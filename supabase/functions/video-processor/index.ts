import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { exec } from "https://deno.land/x/execute@v1.1.0/mod.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const {
    inputVideoPath,
    watermark,
    formats,
    resolutions,
  } = await req.json();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { data: job, error: jobError } = await supabase
    .from("video_processing_jobs")
    .insert({
      user_id: session.user.id,
      input_video_path: inputVideoPath,
      status: "processing",
    })
    .select()
    .single();

  if (jobError) {
    console.error("Job creation error:", jobError);
    return new Response(JSON.stringify({ error: "Failed to create job" }), { status: 500 });
  }

  try {
    // Download video
    const { data: videoBlob, error: downloadError } = await supabase.storage
      .from("videos")
      .download(inputVideoPath);
    if (downloadError) throw downloadError;
    await Deno.writeFile("input.mp4", new Uint8Array(await videoBlob.arrayBuffer()));

    // Watermark logic
    let watermarkFilter = "";
    if (watermark.type === "logo" && watermark.logoPath) {
      const { data: logoBlob, error: logoError } = await supabase.storage
        .from("watermarks")
        .download(watermark.logoPath);
      if (logoError) throw logoError;
      await Deno.writeFile("watermark.png", new Uint8Array(await logoBlob.arrayBuffer()));
      watermarkFilter = `overlay=10:10`;
    } else if (watermark.type === "text") {
      watermarkFilter = `drawtext=text='${watermark.text}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=10:y=10`;
    }

    const outputFiles = [];

    // Thumbnail generation
    const thumbnailFilename = `${inputVideoPath.split('.')[0]}-thumbnail.png`;
    const thumbnailCommand = `ffmpeg -i input.mp4 -vf "select='eq(pict_type,PICT_TYPE_I)'" -vsync 2 -ss 00:00:02 -vframes 1 ${thumbnailFilename}`;
    await exec(thumbnailCommand);
    const thumbnailContent = await Deno.readFile(thumbnailFilename);
    await supabase.storage
        .from("processed-videos")
        .upload(thumbnailFilename, thumbnailContent);


    for (const format of formats) {
      for (const resolution of resolutions) {
        const outputFilename = `${inputVideoPath.split('.')[0]}-${resolution}.${format}`;

        let videoFilters = [];
        if (resolution === "1080p") videoFilters.push("scale=1920:1080");
        if (resolution === "720p") videoFilters.push("scale=1280:720");
        if (resolution === "4k") videoFilters.push("scale=3840:2160");
        if (watermarkFilter) videoFilters.push(watermarkFilter);
        videoFilters.push("noise=alls=2:allf=t");


        const ffmpegCommand = `ffmpeg -i input.mp4 ${watermark.type === 'logo' ? '-i watermark.png' : ''} -filter_complex "${videoFilters.join(',')}" -c:v libx264 -c:a aac -b:v 1450k -b:a 128k -r 29.97 -map_metadata -1 -metadata title="newFile" -af "asetrate=44100*1.002,aresample=44100" ${outputFilename}`;

        await exec(ffmpegCommand);

        const fileContent = await Deno.readFile(outputFilename);
        await supabase.storage
          .from("processed-videos")
          .upload(outputFilename, fileContent);

        const { data: { publicUrl } } = supabase.storage.from("processed-videos").getPublicUrl(outputFilename);
        outputFiles.push({
            path: outputFilename,
            url: publicUrl,
            format: format,
            resolution: resolution,
            size: fileContent.length,
        });
      }
    }

    const { data: { publicUrl: thumbnailUrl } } = supabase.storage.from("processed-videos").getPublicUrl(thumbnailFilename);
    outputFiles.push({
        path: thumbnailFilename,
        url: thumbnailUrl,
        format: 'png',
        resolution: 'thumbnail',
        size: thumbnailContent.length,
    });


    await supabase
      .from("video_processing_jobs")
      .update({ status: "completed", output_files: outputFiles })
      .eq("id", job.id);

    return new Response(JSON.stringify({ jobId: job.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Processing error:", error);
    await supabase
      .from("video_processing_jobs")
      .update({ status: "failed" })
      .eq("id", job.id);
    return new Response(JSON.stringify({ error: "Processing failed" }), { status: 500 });
  }
});
