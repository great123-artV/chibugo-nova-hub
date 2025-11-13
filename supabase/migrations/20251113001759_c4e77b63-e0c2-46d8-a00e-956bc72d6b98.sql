-- Create video_uploads table for video editor
CREATE TABLE public.video_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploader_email TEXT,
  uploader_name TEXT,
  permission_confirmed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'approved', 'rejected')),
  transformations JSONB DEFAULT '[]'::jsonb,
  output_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_uploads ENABLE ROW LEVEL SECURITY;

-- Anyone can upload and view their own videos
CREATE POLICY "Anyone can upload videos"
ON public.video_uploads
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Videos are viewable by everyone"
ON public.video_uploads
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_video_uploads_updated_at
BEFORE UPDATE ON public.video_uploads
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', false);

-- Storage policies for videos
CREATE POLICY "Anyone can upload videos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Videos are viewable by everyone"
ON storage.objects
FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Anyone can update their videos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'videos');

CREATE POLICY "Anyone can delete videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'videos');