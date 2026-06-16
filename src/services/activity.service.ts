import { supabase } from "../lib/supabase";

export interface AuditLogItem {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: any;
  new_value: any;
  created_at: string;
  user_name: string;
}

export async function fetchAuditLogs(
  limit: number = 20,
  offset: number = 0
): Promise<{ data: AuditLogItem[]; count: number; error: string | null }> {
  try {
    const { data, error, count } = await supabase
      .from("activity_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const formattedData: AuditLogItem[] = (data || []).map((log: any) => ({
      id: log.id,
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id,
      old_value: log.old_value,
      new_value: log.new_value,
      created_at: log.created_at,
      user_name: log.user_name || "System",
    }));

    return { data: formattedData, count: count || 0, error: null };
  } catch (err: any) {
    console.error("Error fetching audit logs:", err);
    return { data: [], count: 0, error: err.message || "Failed to fetch audit logs" };
  }
}
