import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Verify Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error(`Auth failed: ${userError?.message || 'Invalid session'}`);
    }

    // 2. Parse Request & Configuration
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ message: "System Error: AI service is not configured correctly. Please contact support." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Construct System Prompt
    const systemPrompt = `You are Nova, the official customer support and sales assistant for Chibugo Computer Tech / Real Estate.

DETAILS:
- Business: Chibugo Computer Tech / Real Estate
- Address: 16 New Market Road, Digital World Plaza, Opposite GTBank, Shop A118, Onitsha, Anambra State.
- Phone (Gadgets): 08161844109
- Phone (Real Estate): 07045024855

SERVICES:
- Gadgets: Phones, Laptops, Accessories (Sales & Repairs)
- Real Estate: Land, Houses, Construction Contracts

BEHAVIOR:
- Be professional, friendly, and helpful.
- Direct people to our office or phone numbers for specific inquiries.
- Give short, clear answers. No markdown (* or #).`;

    // 4. Fetch Inventory Context
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('name, price, stock, type')
      .gt('stock', 0)
      .limit(50);

    let inventoryContext = "";
    if (products && products.length > 0) {
      inventoryContext = "\n\nCURRENT INVENTORY (Use this to answer questions about price and availability):\n";
      products.forEach((p: any) => {
        inventoryContext += `- ${p.name} (${p.type}): ₦${p.price.toLocaleString()} | Stock: ${p.stock}\n`;
      });
    }

    const finalSystemPrompt = systemPrompt + inventoryContext;

    // 4. Call Google Gemini API
    // Using gemini-1.5-flash for stability and speed
    const geminiContent = [
      { role: "user", parts: [{ text: finalSystemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I am Nova." }] },
      ...messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiContent,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ message: "I'm having trouble connecting to my brain right now. Please try again later." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";

    return new Response(
      JSON.stringify({ message: reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Nova Error:", error);
    return new Response(
      JSON.stringify({ message: "I encountered an internal system error. Please try again." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
