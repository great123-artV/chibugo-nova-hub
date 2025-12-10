import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message } = await req.json();

    // Initialize Supabase client with Service Role Key to access admin data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 1. Get all admin user IDs
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (rolesError) throw rolesError;

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admins found to notify.");
      return new Response(
        JSON.stringify({ message: "Message received (no admins to notify)" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminIds = adminRoles.map((r) => r.user_id);

    // 2. Get emails for these admin IDs
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("email")
      .in("id", adminIds);

    if (profilesError) throw profilesError;

    if (!profiles || profiles.length === 0) {
      console.log("No admin profiles found with emails.");
      return new Response(
        JSON.stringify({ message: "Message received (no admin emails found)" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminEmails = profiles.map((p) => p.email);
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("No RESEND_API_KEY configured");
      throw new Error("Missing RESEND_API_KEY");
    }

    // 3. Send email via Resend
    // We send to the first admin and BCC the rest to avoid exposing all emails to each other if preferred,
    // or just send individual emails. For simplicity/rate limits, one email with multiple recipients is often easier,
    // but Resend 'to' array works well.
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Chibugo Tech <onboarding@resend.dev>", // Or a verified domain if available
        to: adminEmails,
        subject: `New Inquiry from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; background-color: #fff;">
            <div style="border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
              <h1 style="color: #333; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Internal Discussion Memorandum</h1>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="font-weight: bold; width: 80px; padding: 5px 0; color: #666;">TO:</td>
                <td style="padding: 5px 0;">Administration Team</td>
              </tr>
              <tr>
                <td style="font-weight: bold; width: 80px; padding: 5px 0; color: #666;">FROM:</td>
                <td style="padding: 5px 0;">Chibugo Nova Automated System</td>
              </tr>
              <tr>
                <td style="font-weight: bold; width: 80px; padding: 5px 0; color: #666;">DATE:</td>
                <td style="padding: 5px 0;">${new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; width: 80px; padding: 5px 0; color: #666;">SUBJECT:</td>
                <td style="padding: 5px 0;"><strong>Inquiry Received: ${name}</strong></td>
              </tr>
            </table>

            <div style="border-top: 1px solid #eee; margin-top: 10px; padding-top: 20px;">
              <p style="margin-bottom: 15px; color: #333;">This memorandum serves to notify the administration of a new client inquiry received via the corporate website. The particulars are as follows:</p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #0f172a; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Client Name:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email Address:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Contact Number:</strong> ${phone || "Not Provided"}</p>
              </div>

              <h3 style="color: #333; font-size: 16px; margin-bottom: 10px; text-transform: uppercase;">Message Content</h3>
              <div style="font-style: italic; color: #555; line-height: 1.6; padding: 10px; background-color: #fff; border: 1px solid #eee;">
                "${message.replace(/\n/g, "<br>")}"
              </div>

              <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #999; text-align: center;">
                CONFIDENTIALITY NOTICE: The information contained in this message is privileged and confidential, intended only for the use of the individual or entity named above.
              </p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API Error:", data);
      throw new Error("Failed to send email via Resend");
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-contact-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
