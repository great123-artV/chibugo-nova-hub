# How to Deploy the Chatbot Function

Since you moved to a new Supabase project, you need to deploy the "Brain" of the chatbot (the Edge Function) and tell it your API keys.

## Prerequisites

1.  **Supabase Access Token**:

    - Go to [Supabase Dashboard > Access Tokens](https://supabase.com/dashboard/account/tokens).
    - Generate a new token and name it "CLI".
    - **Copy it** immediately.

2.  **Lovable (or OpenAI) API Key**:
    - The current code uses `LOVABLE_API_KEY`.
    - If you don't have this, we can switch the code to use OpenAI or Gemini directly (let me know if you want this!).

## Step 1: Login to Supabase CLI

Open your terminal (VS Code terminal is fine) and run:

```bash
npx supabase login
```

It will ask for your Access Token. Paste the token you copied in Prerequisite 1.

## Step 2: Deploy the Function

Run this command to deploy the chatbot function to your new project:

```bash
npx supabase functions deploy nova-chat --project-ref sgmsjdvrsbnygrpanjqy
```

_(Note: `sgmsjdvrsbnygrpanjqy` is your new Project ID)_

If it asks "Do you want to update config.toml?", say **yes**.

## Step 3: Set Secrets

The chatbot needs an API key to work. Run this command (replacing `YOUR_KEY` with your actual key):

```bash
npx supabase secrets set LOVABLE_API_KEY=your_actual_api_key_here --project-ref sgmsjdvrsbnygrpanjqy
```

## Troubleshooting

- If the deploy command fails, ensure you are in the root folder of your project (`c:\Users\USER\chibugo-nova-hub`).
- If you see "Function not found" errors in the chatbot, wait 1-2 minutes after deploying.
