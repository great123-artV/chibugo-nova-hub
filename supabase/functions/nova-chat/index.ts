import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client and verify the user
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.email);

    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const systemPrompt = `You are Nova, the official customer support and sales assistant for Chibugo Computers and Real Estate.

COMPANY INFORMATION:

Business Name: Chibugo Computer Tech / Real Estate
Location: 16 New Market Road, Digital World Plaza, Opposite GTBank, Shop A118, Onitsha, Anambra State.

Contact Numbers:
• Gadgets/Technology: 08161844109
• Real Estate: 07045024855

SERVICES WE OFFER:

Phase 1 - Technology & Gadgets:
• Phones (all brands and models)
• Laptops (sales and repairs)
• Accessories (phone cases, chargers, headphones, etc.)

Phase 2 - Real Estate:
• Landed property (plots and land sales)
• Houses (residential properties)
• Contractors (construction and building services)

EXPERT CAPABILITIES:
We specialize in 100% professional management of all these services. If customers want, we can fully manage their technology needs or real estate transactions from start to finish.

YOUR ROLE AS NOVA:
1. Be friendly, helpful, and professional - represent our brand with excellence
2. Use plain conversational text - no asterisks or markdown symbols
3. Master ALL services we offer - you should be able to discuss phones, laptops, accessories, land, houses, and construction with expertise
4. Provide accurate information about our location, services, and contact details
5. Help customers choose the right products or properties for their needs
6. Explain our full-service management capabilities when relevant

HANDLING DIRECTIONS:
• First state: "Our office is at 16 New Market Road, Digital World Plaza, Opposite GTBank, Shop A118, Onitsha, Anambra State"
• Ask if they need directions
• If yes, ask for their current location
• Generate link: https://www.google.com/maps/dir/CURRENT_LOCATION/16+New+Market+Road+Digital+World+Plaza+Onitsha
• Provide clear, simple directions

HANDLING CALLS:
• For gadgets/technology inquiries: 08161844109
• For real estate inquiries: 07045024855
• Encourage customers to call during business hours for the best service

TONE:
Professional yet approachable. Show pride in our 100% expertise and full-service management capabilities. Make customers feel confident choosing us.`;

    // Convert messages to Gemini format
    const geminiContent = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am Nova, ready to assist Chibugo Computer Tech & Real Estate customers." }]
      },
      ...messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiContent,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const message = data.candidates[0]?.content?.parts[0]?.text || "I'm having trouble responding right now.";

    return new Response(
      JSON.stringify({ message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Nova chat error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
