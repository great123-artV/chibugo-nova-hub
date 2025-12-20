-- RLS is usually already enabled for storage.objects, so we skip enabling it explicitly to avoid permission errors.


-- Create policy to allow authenticated uploads to 'media' bucket
create policy "Allow authenticated uploads to media bucket"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'media' );

-- Create policy to allow public viewing of 'media' bucket
create policy "Allow public viewing of media bucket"
on storage.objects for select
to public
using ( bucket_id = 'media' );

-- Create policy to allow authenticated deletions (optional, for cleanup)
create policy "Allow users to delete their own media"
on storage.objects for delete
to authenticated
using ( bucket_id = 'media' and auth.uid() = owner );
