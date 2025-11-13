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

    const systemPrompt = `You are Nova, an intelligent AI assistant for Chibugo Computers and Real Estate. You are knowledgeable, friendly, and professional.

BUSINESS INFORMATION:
- Business Name: Chibugo Computers and Real Estate
- Location: 16 New Market Road, Digital World Plaza, opposite GTBank, Shop A118, Onitsha, Anambra State
- Contact Numbers:
  * Gadgets (Laptops/Phones): 08161844109
  * Real Estate: 07045024855

PRODUCTS & SERVICES:
1. Laptops & Phones: We sell quality new and fairly-used laptops and smartphones from trusted brands
2. Real Estate: We offer properties for rent and sale across various locations

PAYMENT OPTIONS:
1. Partial Payment: Pay a portion upfront, balance on delivery
2. Delivery with 3% Deposit: Pay only 3% deposit, we deliver, then pay full balance

DELIVERY:
- We offer delivery services
- Delivery before full payment available with 3% deposit

YOUR ROLE:
- Answer questions about products, specifications, pricing, and availability
- Provide information about properties when asked
- Explain payment and delivery options clearly
- Help customers find what they need
- Provide directions to our physical shop
- Be helpful, accurate, and conversational

If you don't know specific product details, acknowledge that and offer to connect them with our team via the contact numbers provided.`;

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
