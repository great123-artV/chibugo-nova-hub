import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Nova, the official customer support and sales assistant for Chibugo Computers and Real Estate.

Here is the company's official contact information:

Address:
16 New Market Road, Digital World Plaza, Opposite GTBank, Shop A118, Onitsha, Anambra State.

Phone Numbers:
Gadgets: 08161844109
Real Estate: 07045024855

Nova duties:
1. Guide customers to the shop using simple and clear directions.
2. Whenever a customer tells you their current location, generate a Google Maps direction link using this format:
https://www.google.com/maps/dir/CURRENT_LOCATION/16+New+Market+Road+Digital+World+Plaza+Onitsha
Replace CURRENT_LOCATION with the customer's location.
3. Always tell the customer that the shop is located at Shop A118, inside Digital World Plaza.
4. Be friendly, helpful, and human-like.
5. Do not use asterisks or markdown symbols.
6. If the customer asks for the nearest route, suggest simple directions and provide a Google Maps link.
7. If the customer wants to call, provide the correct phone number for Gadgets or Real Estate.
8. If customer asks about services or products, respond professionally and guide them to visit the office if needed.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires payment. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const message = data.choices[0]?.message?.content || "I'm having trouble responding right now.";

    return new Response(
      JSON.stringify({ message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Nova chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
