import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.email);

    const { jobId, action } = await req.json();
    console.log('Action:', action, 'JobId:', jobId);

    if (action === 'get-status') {
      // Get job status
      const { data: job, error: jobError } = await supabase
        .from('video_processing_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (jobError) {
        console.error('Job fetch error:', jobError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch job' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!job) {
        return new Response(
          JSON.stringify({ error: 'Job not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ job }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'list-jobs') {
      // List user's jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('video_processing_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (jobsError) {
        console.error('Jobs fetch error:', jobsError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch jobs' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Found', jobs?.length || 0, 'jobs for user');

      return new Response(
        JSON.stringify({ jobs: jobs || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'cleanup-expired') {
      // Clean up expired files - requires admin access
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: expiredJobs, error: fetchError } = await adminClient
        .from('video_processing_jobs')
        .select('id, output_files, user_id')
        .lt('expires_at', new Date().toISOString());

      if (fetchError) {
        console.error('Failed to fetch expired jobs:', fetchError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch expired jobs' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let deletedFiles = 0;
      for (const job of expiredJobs || []) {
        const outputFiles = job.output_files as any[] || [];
        for (const file of outputFiles) {
          if (file.path) {
            const { error: deleteError } = await adminClient.storage
              .from('processed-videos')
              .remove([file.path]);
            if (!deleteError) {
              deletedFiles++;
            }
          }
        }
        await adminClient.from('video_processing_jobs').delete().eq('id', job.id);
      }

      console.log(`Cleaned up ${expiredJobs?.length || 0} expired jobs, ${deletedFiles} files`);

      return new Response(
        JSON.stringify({ 
          cleaned: expiredJobs?.length || 0, 
          filesDeleted: deletedFiles 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Supported: get-status, list-jobs, cleanup-expired' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in process-video function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
