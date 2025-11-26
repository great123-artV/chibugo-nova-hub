CREATE TABLE video_processing_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  input_video_path text NOT NULL,
  output_files jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);
