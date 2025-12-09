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
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
            ${message.replace(/\n/g, "<br>")}
          </blockquote>
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
