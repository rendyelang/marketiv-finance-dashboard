// Follow this setup guide to integrate the Deno language server with your editor:
// https://supabase.com/docs/guides/functions/local-development#editor-setup

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the JWT from the Authorization header to verify who is making the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: requestingUser }, error: verifyError } = await supabaseAdmin.auth.getUser(token);
    
    if (verifyError || !requestingUser) {
      throw new Error('Unauthorized');
    }

    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false }
    });

    // Check if the requesting user is an admin by querying the public.users table
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('role, full_name')
      .eq('auth_user_id', requestingUser.id)
      .single();
      
    if (adminError || !adminData || (adminData.role !== 'ADMIN' && adminData.role !== 'admin')) {
      const dbg = `URL: ${supabaseUrl.length}, SKey: ${supabaseServiceKey.length}, AKey: ${(Deno.env.get("SUPABASE_ANON_KEY") || "").length}`;
      throw new Error(`Forbidden: Only administrators can invite users. DB Role: ${adminData?.role}, Error: ${adminError?.message}. Debug: ${dbg}`);
    }

    // Parse request body
    const { email, full_name, position, role } = await req.json();

    if (!email || !full_name || !role) {
      throw new Error('Missing required fields');
    }

    // 1. Invite the user via Supabase Auth
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { full_name, position, role },
    });

    if (inviteError) {
      throw inviteError;
    }

    const newAuthUserId = inviteData.user.id;

    // 2. Insert into public.users table
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          full_name,
          email,
          position,
          role,
          status: 'INVITED',
          auth_user_id: newAuthUserId,
        }
      ]);

    if (insertError) {
      // If profile insert fails, we should ideally clean up the auth user, but for MVP we return the error.
      throw insertError;
    }

    // 3. Log the activity
    await supabaseAdmin
      .from('activity_logs')
      .insert([{
        user_name: adminData.full_name || "Admin",
        action: 'USER_CREATED',
        entity_type: 'user',
        entity_id: newAuthUserId,
        new_value: { email, full_name, role, status: 'INVITED' }
      }]);

    return new Response(
      JSON.stringify({ success: true, message: "User invited successfully", userId: newAuthUserId }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error inviting user:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message || error }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
