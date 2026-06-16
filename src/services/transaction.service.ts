import { supabase } from "../lib/supabase";

export interface TransactionAttachment {
  id: string;
  transaction_id: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: any;
  new_value: any;
  created_at: string;
}

export interface DBTransaction {
  id: string;
  budget_item_id: string | null;
  type: string;
  date: string;
  amount: number;
  description: string;
  person_in_charge: string;
  status: string;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionWithRelations extends DBTransaction {
  budget_items?: { 
    name: string;
    budget_activities?: {
      budget_categories?: {
        name: string;
      } | null;
    } | null;
  } | null;
  attachments: TransactionAttachment[];
  activity_logs?: ActivityLog[];
}

export async function logActivity(
  action: string,
  entity_type: string,
  entity_id: string,
  old_value: any = null,
  new_value: any = null
) {
  const userResp = await supabase.auth.getUser();
  const authUserId = userResp.data.user?.id;
  let user_name = "System";

  if (authUserId) {
    const { data: userRecord } = await supabase
      .from("users")
      .select("full_name")
      .eq("auth_user_id", authUserId)
      .single();
    if (userRecord?.full_name) {
      user_name = userRecord.full_name;
    }
  }

  const { error } = await supabase.from("activity_logs").insert({
    action,
    entity_type,
    entity_id,
    user_name,
    old_value,
    new_value,
  });

  if (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function fetchTransactions(): Promise<{ data: TransactionWithRelations[]; error: string | null }> {
  // Fetch transactions with categories and items joined.
  // We also fetch attachments using a separate query or join if Supabase allows.
  // Actually, Supabase can fetch relations nicely.
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      budget_items (
        name,
        budget_activities (
          budget_categories (
            name
          )
        )
      ),
      attachments ( * )
    `)
    .order("date", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }
  
  return { data: data as any, error: null };
}

export async function addTransaction(
  payload: {
    type: string;
    date: string;
    amount: number;
    description: string;
    budget_item_id: string | null;
    person_in_charge: string;
    status: string;
    notes: string;
  }
): Promise<{ data: DBTransaction | null; error: string | null }> {
  const userResp = await supabase.auth.getUser();
  const userId = userResp.data.user?.id;
  
  if (!userId) {
    return { data: null, error: "User is not authenticated." };
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      transaction_number: `TRX-${Date.now()}`,
      type: payload.type,
      date: payload.date,
      amount: Number(payload.amount),
      description: payload.description,
      budget_item_id: payload.budget_item_id,
      person_in_charge: payload.person_in_charge,
      status: payload.status,
      notes: payload.notes || null,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  // Log activity
  await logActivity(
    "TRANSACTION_CREATED",
    "transaction",
    data.id,
    null,
    data
  );

  return { data, error: null };
}

export async function updateTransaction(
  id: string,
  payload: {
    type: string;
    date: string;
    amount: number;
    description: string;
    budget_item_id: string | null;
    person_in_charge: string;
    status: string;
    notes: string;
  }
): Promise<{ data: DBTransaction | null; error: string | null }> {
  const userResp = await supabase.auth.getUser();
  const userId = userResp.data.user?.id;

  if (!userId) {
    return { data: null, error: "User is not authenticated." };
  }

  // Fetch old transaction for activity log
  const { data: oldTx } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("transactions")
    .update({
      type: payload.type,
      date: payload.date,
      amount: Number(payload.amount),
      description: payload.description,
      budget_item_id: payload.budget_item_id,
      person_in_charge: payload.person_in_charge,
      status: payload.status,
      notes: payload.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  await logActivity(
    "TRANSACTION_UPDATED",
    "transaction",
    data.id,
    oldTx,
    data
  );

  return { data, error: null };
}

export async function updateTransactionStatus(
  id: string,
  newStatus: string
): Promise<{ data: DBTransaction | null; error: string | null }> {
  const { data, error } = await supabase
    .from("transactions")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  await logActivity("TRANSACTION_UPDATED", "transaction", id, null, { status: newStatus });
  return { data, error: null };
}

export async function uploadAttachment(
  transactionId: string,
  file: File
): Promise<{ data: TransactionAttachment | null; error: string | null }> {
  const ext = file.name.split(".").pop();
  const fileName = `${transactionId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { error: uploadError } = await supabase.storage
    .from("transaction-documents")
    .upload(fileName, file);

  if (uploadError) {
    return { data: null, error: "Storage Error: " + uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("transaction-documents")
    .getPublicUrl(fileName);

  const userResp = await supabase.auth.getUser();
  const userId = userResp.data.user?.id;

  // Save metadata to attachments table
  const { data, error: dbError } = await supabase
    .from("attachments")
    .insert({
      transaction_id: transactionId,
      file_name: file.name,
      file_url: publicUrlData.publicUrl,
      file_type: file.type || "unknown",
      file_size: file.size || 0,
      uploaded_by: userId,
    })
    .select()
    .single();

  if (dbError) {
    return { data: null, error: "Database Error: " + dbError.message };
  }

  await logActivity("ATTACHMENT_UPLOADED", "attachment", data.id, null, { file_name: file.name });
  
  return { data, error: null };
}

export async function deleteAttachment(
  attachmentId: string,
  fileUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // 1. Delete from storage
    // extract path from public URL
    // e.g. https://<project>.supabase.co/storage/v1/object/public/transaction-documents/txn_id/timestamp-hash.ext
    const urlParts = fileUrl.split("/transaction-documents/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      const { error: storageError } = await supabase.storage
        .from("transaction-documents")
        .remove([filePath]);
      if (storageError) {
         console.warn("Storage removal warning:", storageError.message);
         // Continue deleting from DB even if storage fails just in case
      }
    }

    // 2. Delete from DB
    const { error: dbError } = await supabase
      .from("attachments")
      .delete()
      .eq("id", attachmentId);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    await logActivity("ATTACHMENT_DELETED", "attachment", attachmentId);
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchTransactionActivityLogs(transactionId: string): Promise<{ data: ActivityLog[]; error: string | null }> {
  // Activity logs belong to entities. 
  // We should fetch logs for the transaction, AND for its attachments.
  // First, fetch the attachments for this transaction.
  const { data: attachments } = await supabase.from("attachments").select("id").eq("transaction_id", transactionId);
  const attachmentIds = attachments?.map(a => a.id) || [];

  // Then fetch activity logs for transaction OR attachments
  let query = supabase.from("activity_logs").select("*").order("created_at", { ascending: false });
  
  if (attachmentIds.length > 0) {
    query = query.or(`and(entity_type.eq.transaction,entity_id.eq.${transactionId}),and(entity_type.eq.attachment,entity_id.in.(${attachmentIds.join(',')}))`);
  } else {
    query = query.eq("entity_type", "transaction").eq("entity_id", transactionId);
  }

  const { data, error } = await query;
  return { data: data ?? [], error: error?.message ?? null };
}
