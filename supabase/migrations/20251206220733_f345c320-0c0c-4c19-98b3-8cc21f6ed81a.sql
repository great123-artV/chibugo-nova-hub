-- Create video_processing_jobs table
CREATE TABLE public.video_processing_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  input_filename TEXT NOT NULL,
  input_file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  watermark_type TEXT, -- 'text', 'logo', 'none'
  watermark_text TEXT,
  watermark_position TEXT DEFAULT 'bottom-right',
  output_formats TEXT[] DEFAULT '{mp4}',
  output_resolutions TEXT[] DEFAULT '{1080p}',
  output_files JSONB DEFAULT '[]',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '48 hours')
);

-- Enable RLS
ALTER TABLE public.video_processing_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own jobs"
ON public.video_processing_jobs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs"
ON public.video_processing_jobs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
ON public.video_processing_jobs
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all jobs"
ON public.video_processing_jobs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create processed-videos bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('processed-videos', 'processed-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for processed-videos bucket
CREATE POLICY "Users can upload processed videos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'processed-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view processed videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'processed-videos');

CREATE POLICY "Users can delete their processed videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'processed-videos' AND auth.uid() IS NOT NULL);

-- Trigger for updated_at
CREATE TRIGGER update_video_processing_jobs_updated_at
BEFORE UPDATE ON public.video_processing_jobs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();