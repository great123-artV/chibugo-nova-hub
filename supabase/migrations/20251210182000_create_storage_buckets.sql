-- Create buckets
insert into storage.buckets (id, name, public)
values 
  ('videos', 'videos', false),
  ('watermarks', 'watermarks', false),
  ('processed-videos', 'processed-videos', false)
on conflict (id) do nothing;

-- Policies for videos
create policy "Admin Upload Videos" on storage.objects
  for insert to authenticated
  with check ( bucket_id = 'videos' );

create policy "Admin View Videos" on storage.objects
  for select to authenticated
  using ( bucket_id = 'videos' );

-- Policies for watermarks
create policy "Admin Upload Watermarks" on storage.objects
  for insert to authenticated
  with check ( bucket_id = 'watermarks' );

create policy "Admin View Watermarks" on storage.objects
  for select to authenticated
  using ( bucket_id = 'watermarks' );

-- Policies for processed-videos
create policy "Admin Upload Processed Videos" on storage.objects
  for insert to authenticated
  with check ( bucket_id = 'processed-videos' );

create policy "Admin View Processed Videos" on storage.objects
  for select to authenticated
  using ( bucket_id = 'processed-videos' );
