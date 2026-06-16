import { supabase } from "../lib/supabase";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  position: string;
  role: "ADMIN" | "MEMBER";
  status: "ACTIVE" | "INVITED" | "INACTIVE";
  auth_user_id: string;
  last_active_at: string;
  created_at: string;
}

export async function fetchUsers(): Promise<{ data: UserProfile[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return { data: [], error: err.message || "Failed to fetch users" };
  }
}

export async function inviteUser(userData: {
  email: string;
  full_name: string;
  position: string;
  role: "ADMIN" | "MEMBER";
}): Promise<{ success: boolean; error: string | null }> {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) throw new Error("No active session found");

    // @ts-ignore - access internal url
    const supabaseUrl = supabase.supabaseUrl;

    const response = await fetch(`${supabaseUrl}/functions/v1/invite-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const text = await response.text();
    
    if (!response.ok) {
      console.error("RAW EDGE FUNCTION RESPONSE:", text);
      throw new Error(`Edge function failed: ${text}`);
    }

    const data = JSON.parse(text);

    if (data && data.success === false) throw new Error(data.error);

    return { success: true, error: null };
  } catch (err: any) {
    console.error("Error inviting user:", err);
    // If the edge function returned a JSON error, we want to see it
    return { success: false, error: err.message || "Failed to invite user" };
  }
}

export async function updateUser(
  id: string,
  updates: { role?: "ADMIN" | "MEMBER"; position?: string },
  adminName: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    // Log activity
    await supabase.from("activity_logs").insert([
      {
        action: "USER_UPDATED",
        entity_type: "user",
        entity_id: id,
        user_name: adminName,
        new_value: updates,
      },
    ]);

    return { success: true, error: null };
  } catch (err: any) {
    console.error("Error updating user:", err);
    return { success: false, error: err.message || "Failed to update user" };
  }
}

export async function disableUser(
  id: string,
  adminName: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("users")
      .update({ status: "INACTIVE" })
      .eq("id", id);

    if (error) throw error;

    // Log activity
    await supabase.from("activity_logs").insert([
      {
        action: "USER_UPDATED",
        entity_type: "user",
        entity_id: id,
        user_name: adminName,
        new_value: { status: "INACTIVE" },
      },
    ]);

    return { success: true, error: null };
  } catch (err: any) {
    console.error("Error disabling user:", err);
    return { success: false, error: err.message || "Failed to disable user" };
  }
}
