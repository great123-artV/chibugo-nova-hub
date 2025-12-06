import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { supabase } from '@/integrations/supabase/client';

export interface WatermarkConfig {
  type: 'none' | 'text' | 'logo';
  text?: string;
  logoFile?: File;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export interface ProcessingConfig {
  watermark: WatermarkConfig;
  formats: ('mp4' | 'mov' | 'mkv' | 'webm' | 'avi')[];
  resolutions: ('1080p' | '720p' | '4k')[];
  applyBypassProtection: boolean;
}

export interface OutputFile {
  name: string;
  format: string;
  resolution: string;
  size: number;
  url: string;
  blob: Blob;
}

export interface ProcessingProgress {
  stage: string;
  progress: number;
  currentFile?: string;
}

const RESOLUTION_MAP = {
  '4k': { width: 3840, height: 2160 },
  '1080p': { width: 1920, height: 1080 },
  '720p': { width: 1280, height: 720 },
};

const FORMAT_CODECS = {
  mp4: { video: 'libx264', audio: 'aac', ext: 'mp4' },
  mov: { video: 'libx264', audio: 'aac', ext: 'mov' },
  mkv: { video: 'libx264', audio: 'aac', ext: 'mkv' },
  webm: { video: 'libvpx-vp9', audio: 'libopus', ext: 'webm' },
  avi: { video: 'libx264', audio: 'aac', ext: 'avi' },
};

export function useVideoProcessor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ stage: '', progress: 0 });
  const [outputFiles, setOutputFiles] = useState<OutputFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const loadedRef = useRef(false);

  const loadFFmpeg = useCallback(async () => {
    if (loadedRef.current && ffmpegRef.current) return ffmpegRef.current;
    
    setIsLoading(true);
    setProgress({ stage: 'Loading FFmpeg...', progress: 10 });
    
    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on('progress', ({ progress: p }) => {
        setProgress(prev => ({ ...prev, progress: Math.round(p * 100) }));
      });

      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message);
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      loadedRef.current = true;
      setIsLoading(false);
      return ffmpeg;
    } catch (err) {
      console.error('Failed to load FFmpeg:', err);
      setError('Failed to load video processor. Please refresh and try again.');
      setIsLoading(false);
      throw err;
    }
  }, []);

  const getPositionOverlay = (position: WatermarkConfig['position'], videoWidth: number, videoHeight: number) => {
    const padding = 20;
    switch (position) {
      case 'top-left': return `overlay=${padding}:${padding}`;
      case 'top-right': return `overlay=W-w-${padding}:${padding}`;
      case 'bottom-left': return `overlay=${padding}:H-h-${padding}`;
      case 'bottom-right': return `overlay=W-w-${padding}:H-h-${padding}`;
      case 'center': return `overlay=(W-w)/2:(H-h)/2`;
      default: return `overlay=W-w-${padding}:H-h-${padding}`;
    }
  };

  const getTextPosition = (position: WatermarkConfig['position']) => {
    const padding = 20;
    switch (position) {
      case 'top-left': return `x=${padding}:y=${padding}`;
      case 'top-right': return `x=w-tw-${padding}:y=${padding}`;
      case 'bottom-left': return `x=${padding}:y=h-th-${padding}`;
      case 'bottom-right': return `x=w-tw-${padding}:y=h-th-${padding}`;
      case 'center': return `x=(w-tw)/2:y=(h-th)/2`;
      default: return `x=w-tw-${padding}:y=h-th-${padding}`;
    }
  };

  const processVideo = useCallback(async (
    videoFile: File,
    config: ProcessingConfig
  ): Promise<OutputFile[]> => {
    setError(null);
    setOutputFiles([]);
    setIsProcessing(true);

    try {
      const ffmpeg = await loadFFmpeg();
      if (!ffmpeg) throw new Error('FFmpeg not loaded');

      // Create job record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to process videos');

      const { data: job, error: jobError } = await supabase
        .from('video_processing_jobs')
        .insert({
          user_id: user.id,
          input_filename: videoFile.name,
          input_file_path: `uploads/${user.id}/${videoFile.name}`,
          status: 'processing',
          watermark_type: config.watermark.type,
          watermark_text: config.watermark.text,
          watermark_position: config.watermark.position,
          output_formats: config.formats,
          output_resolutions: config.resolutions,
        })
        .select()
        .single();

      if (jobError) throw new Error('Failed to create processing job');
      setJobId(job.id);

      setProgress({ stage: 'Reading video file...', progress: 5 });
      const inputData = await fetchFile(videoFile);
      await ffmpeg.writeFile('input.mp4', inputData);

      // Write logo if needed
      if (config.watermark.type === 'logo' && config.watermark.logoFile) {
        setProgress({ stage: 'Loading watermark...', progress: 10 });
        const logoData = await fetchFile(config.watermark.logoFile);
        await ffmpeg.writeFile('watermark.png', logoData);
      }

      const results: OutputFile[] = [];
      const totalOperations = config.formats.length * config.resolutions.length + 1; // +1 for thumbnail
      let completedOperations = 0;

      // Generate thumbnail first
      setProgress({ stage: 'Generating thumbnail...', progress: 15, currentFile: 'thumbnail.png' });
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', '00:00:02',
        '-vframes', '1',
        '-q:v', '2',
        'thumbnail.png'
      ]);

      const thumbnailData = await ffmpeg.readFile('thumbnail.png');
      const thumbnailBlob = new Blob([new Uint8Array(thumbnailData as Uint8Array)], { type: 'image/png' });
      const thumbnailUrl = URL.createObjectURL(thumbnailBlob);
      
      results.push({
        name: `${videoFile.name.replace(/\.[^.]+$/, '')}_thumbnail.png`,
        format: 'png',
        resolution: 'thumbnail',
        size: thumbnailBlob.size,
        url: thumbnailUrl,
        blob: thumbnailBlob,
      });
      completedOperations++;

      // Process each format and resolution combination
      for (const format of config.formats) {
        for (const resolution of config.resolutions) {
          const outputName = `${videoFile.name.replace(/\.[^.]+$/, '')}_${resolution}.${format}`;
          setProgress({ 
            stage: `Processing ${resolution} ${format.toUpperCase()}...`, 
            progress: 15 + Math.round((completedOperations / totalOperations) * 80),
            currentFile: outputName
          });

          const { width, height } = RESOLUTION_MAP[resolution];
          const codec = FORMAT_CODECS[format];

          // Build filter complex
          const filters: string[] = [];

          // Scale
          filters.push(`scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`);

          // Bypass protection: invisible noise
          if (config.applyBypassProtection) {
            filters.push('noise=alls=2:allf=t');
          }

          // Text watermark
          if (config.watermark.type === 'text' && config.watermark.text) {
            const pos = getTextPosition(config.watermark.position);
            filters.push(`drawtext=text='${config.watermark.text}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:${pos}`);
          }

          const ffmpegArgs: string[] = ['-i', 'input.mp4'];

          // Logo watermark uses filter_complex
          if (config.watermark.type === 'logo' && config.watermark.logoFile) {
            ffmpegArgs.push('-i', 'watermark.png');
            const overlay = getPositionOverlay(config.watermark.position, width, height);
            ffmpegArgs.push(
              '-filter_complex',
              `[0:v]${filters.join(',')}[main];[main][1:v]${overlay}[out]`,
              '-map', '[out]',
              '-map', '0:a?'
            );
          } else {
            ffmpegArgs.push('-vf', filters.join(','));
          }

          // Codec settings
          if (format === 'webm') {
            ffmpegArgs.push('-c:v', codec.video, '-c:a', codec.audio, '-b:v', '1450k', '-b:a', '128k');
          } else {
            ffmpegArgs.push('-c:v', codec.video, '-c:a', codec.audio, '-b:v', '1450k', '-b:a', '128k');
          }

          // Bypass protection settings
          if (config.applyBypassProtection) {
            ffmpegArgs.push(
              '-r', '29.97',
              '-map_metadata', '-1',
              '-metadata', `title=processed_${Date.now()}`,
              '-af', 'asetrate=44100*1.002,aresample=44100'
            );
          }

          ffmpegArgs.push('-y', `output_${resolution}.${format}`);

          try {
            await ffmpeg.exec(ffmpegArgs);
            
            const outputData = await ffmpeg.readFile(`output_${resolution}.${format}`);
            const mimeType = format === 'webm' ? 'video/webm' : 
                            format === 'mkv' ? 'video/x-matroska' :
                            format === 'avi' ? 'video/x-msvideo' :
                            format === 'mov' ? 'video/quicktime' : 'video/mp4';
            
            const blob = new Blob([new Uint8Array(outputData as Uint8Array)], { type: mimeType });
            const url = URL.createObjectURL(blob);

            results.push({
              name: outputName,
              format,
              resolution,
              size: blob.size,
              url,
              blob,
            });

            // Clean up this output file
            await ffmpeg.deleteFile(`output_${resolution}.${format}`);
          } catch (err) {
            console.error(`Failed to process ${resolution} ${format}:`, err);
          }

          completedOperations++;
        }
      }

      setProgress({ stage: 'Uploading to storage...', progress: 95 });

      // Upload to Supabase Storage
      const uploadedFiles: any[] = [];
      for (const file of results) {
        const storagePath = `${user.id}/${job.id}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('processed-videos')
          .upload(storagePath, file.blob, { upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('processed-videos')
            .getPublicUrl(storagePath);

          uploadedFiles.push({
            name: file.name,
            format: file.format,
            resolution: file.resolution,
            size: file.size,
            url: publicUrl,
            path: storagePath,
          });
        }
      }

      // Update job with results
      await supabase
        .from('video_processing_jobs')
        .update({ 
          status: 'completed', 
          output_files: uploadedFiles 
        })
        .eq('id', job.id);

      setProgress({ stage: 'Complete!', progress: 100 });
      setOutputFiles(results);
      setIsProcessing(false);

      return results;
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'Failed to process video');
      setIsProcessing(false);

      if (jobId) {
        await supabase
          .from('video_processing_jobs')
          .update({ status: 'failed', error_message: err.message })
          .eq('id', jobId);
      }

      throw err;
    }
  }, [loadFFmpeg, jobId]);

  const cleanup = useCallback(() => {
    outputFiles.forEach(file => {
      if (file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    });
    setOutputFiles([]);
    setProgress({ stage: '', progress: 0 });
    setError(null);
    setJobId(null);
  }, [outputFiles]);

  return {
    isLoading,
    isProcessing,
    progress,
    outputFiles,
    error,
    jobId,
    processVideo,
    cleanup,
    loadFFmpeg,
  };
}
