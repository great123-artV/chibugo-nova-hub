-- Drop the existing public SELECT policy on video_uploads
DROP POLICY IF EXISTS "Videos are viewable by everyone" ON public.video_uploads;

-- Create a new policy that only allows authenticated users to view videos
CREATE POLICY "Authenticated users can view videos" 
ON public.video_uploads 
FOR SELECT 
TO authenticated
USING (true);

-- Create policy for uploaders to view their own videos (by email match)
CREATE POLICY "Users can view their own uploads"
ON public.video_uploads
FOR SELECT
USING (uploader_email = (SELECT email FROM auth.users WHERE id = auth.uid()));