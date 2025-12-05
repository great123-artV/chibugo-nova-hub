import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Create client with user's auth token to respect RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.email);

    const { videoId, transformations } = await req.json();

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: "Video ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get video upload record
    const { data: video, error: videoError } = await supabase
      .from("video_uploads")
      .select("*")
      .eq("id", videoId)
      .single();

    if (videoError || !video) {
      console.error("Video fetch error:", videoError?.message);
      return new Response(
        JSON.stringify({ error: "Video not found or access denied" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify ownership - video uploader email must match authenticated user
    if (video.uploader_email !== user.email) {
      console.error("Ownership mismatch:", video.uploader_email, "vs", user.email);
      return new Response(
        JSON.stringify({ error: "You can only process your own videos" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update status to processing
    await supabase
      .from("video_uploads")
      .update({
        status: "processing",
        transformations,
      })
      .eq("id", videoId);

    console.log("Starting video processing:", videoId);
    console.log("Transformations:", JSON.stringify(transformations, null, 2));

    // Download the original video from storage
    const { data: videoData, error: downloadError } = await supabase.storage
      .from("videos")
      .download(video.file_path);

    if (downloadError) {
      console.error("Download error:", downloadError);
      await supabase
        .from("video_uploads")
        .update({ status: "failed" })
        .eq("id", videoId);
      return new Response(
        JSON.stringify({ error: "Failed to download video" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Video downloaded, size:", videoData.size);

    // Process video with FFmpeg
    const processedVideo = await processVideoWithFFmpeg(videoData, transformations);

    console.log("Video processed, uploading result...");

    // Upload processed video
    const outputFileName = `processed/${Date.now()}-${video.original_filename}`;
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(outputFileName, processedVideo, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      await supabase
        .from("video_uploads")
        .update({ status: "failed" })
        .eq("id", videoId);
      return new Response(
        JSON.stringify({ error: "Failed to upload processed video" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update database with completion status
    await supabase
      .from("video_uploads")
      .update({
        status: "completed",
        output_path: outputFileName,
      })
      .eq("id", videoId);

    console.log("Video processing completed successfully:", videoId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Video processed successfully",
        outputPath: outputFileName,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Process video error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function processVideoWithFFmpeg(videoBlob: Blob, transformations: any): Promise<Blob> {
  console.log("Processing with transformations:", transformations);

  // Convert Blob to ArrayBuffer
  const videoBuffer = await videoBlob.arrayBuffer();
  const videoData = new Uint8Array(videoBuffer);

  // Build FFmpeg command arguments
  const args: string[] = ["-i", "input.mp4"];

  // Apply filters
  const filters: string[] = [];

  // Trim video
  if (transformations.trim) {
    const duration = 100;
    const startTime = (transformations.trim.start / 100) * duration;
    const endTime = (transformations.trim.end / 100) * duration;
    args.push("-ss", startTime.toString(), "-to", endTime.toString());
  }

  // Brightness and contrast
  if (transformations.brightness !== 0 || transformations.contrast !== 0) {
    const brightness = transformations.brightness / 100;
    const contrast = 1 + transformations.contrast / 100;
    filters.push(`eq=brightness=${brightness}:contrast=${contrast}`);
  }

  // Speed adjustment
  if (transformations.speed !== 1) {
    const tempo = 1 / transformations.speed;
    filters.push(`setpts=${tempo}*PTS`);
  }

  // Apply color filters
  if (transformations.filter !== "none") {
    switch (transformations.filter) {
      case "grayscale":
        filters.push("hue=s=0");
        break;
      case "sepia":
        filters.push("colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131");
        break;
      case "vintage":
        filters.push("curves=vintage");
        break;
      case "cool":
        filters.push("curves=preset=cool");
        break;
    }
  }

  // Watermark
  if (transformations.watermark) {
    filters.push(`drawtext=text='${transformations.watermark}':fontsize=24:fontcolor=white@0.7:x=10:y=H-th-10`);
  }

  // Add filters to command
  if (filters.length > 0) {
    args.push("-vf", filters.join(","));
  }

  // Export preset settings
  switch (transformations.exportPreset) {
    case "youtube":
      args.push("-c:v", "libx264", "-preset", "medium", "-crf", "23", "-c:a", "aac", "-b:a", "128k");
      break;
    case "instagram":
      args.push("-c:v", "libx264", "-preset", "medium", "-crf", "25", "-c:a", "aac", "-b:a", "96k", "-s", "1080x1080");
      break;
    case "tiktok":
      args.push("-c:v", "libx264", "-preset", "medium", "-crf", "25", "-c:a", "aac", "-b:a", "128k", "-s", "1080x1920");
      break;
    case "high-quality":
      args.push("-c:v", "libx264", "-preset", "slow", "-crf", "18", "-c:a", "aac", "-b:a", "192k");
      break;
    case "web-optimized":
      args.push("-c:v", "libx264", "-preset", "fast", "-crf", "28", "-c:a", "aac", "-b:a", "96k");
      break;
  }

  args.push("output.mp4");

  console.log("FFmpeg command:", args.join(" "));

  try {
    const { FFmpeg } = await import("https://esm.sh/@ffmpeg/ffmpeg@0.12.10");
    const { toBlobURL } = await import("https://esm.sh/@ffmpeg/util@0.12.1");

    const ffmpeg = new FFmpeg();

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    console.log("FFmpeg loaded successfully");

    await ffmpeg.writeFile("input.mp4", videoData);
    await ffmpeg.exec(args);
    const output = await ffmpeg.readFile("output.mp4");

    console.log("Video processing completed, output size:", output.length);

    let outputData: Uint8Array;
    if (typeof output === "string") {
      const encoder = new TextEncoder();
      outputData = encoder.encode(output);
    } else {
      outputData = output as Uint8Array;
    }
    
    const finalData = new Uint8Array(outputData);
    return new Blob([finalData], { type: "video/mp4" });
  } catch (error) {
    console.error("FFmpeg processing error:", error);
    console.log("Returning original video due to processing error");
    return videoBlob;
  }
}
