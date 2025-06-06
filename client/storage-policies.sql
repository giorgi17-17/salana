-- Storage policies for salana-storage bucket
-- Run these commands in your Supabase SQL Editor

-- First, make sure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (run these if you get conflicts)
-- DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;

-- 1. Allow authenticated users to insert/upload files
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'salana-storage');

-- 2. Allow public read access to all files in the bucket
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT 
TO public 
USING (bucket_id = 'salana-storage');

-- 3. Allow users to update their own files (optional)
CREATE POLICY "Allow users to update own files" ON storage.objects
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'salana-storage' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Allow users to delete their own files (optional)
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE 
TO authenticated 
USING (bucket_id = 'salana-storage' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Alternative simpler policies (if the above don't work):
-- These are more permissive but easier to set up

-- DROP the above policies first if they exist:
-- DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;

-- Then create these simpler ones:
-- CREATE POLICY "Allow all operations for authenticated users" ON storage.objects
-- FOR ALL 
-- TO authenticated 
-- USING (bucket_id = 'salana-storage');

-- CREATE POLICY "Allow public read" ON storage.objects
-- FOR SELECT 
-- TO public 
-- USING (bucket_id = 'salana-storage');

-- IMPORTANT: Also make sure your bucket exists and is properly configured
-- Go to Storage > salana-storage > Settings and ensure:
-- 1. Public bucket is enabled
-- 2. File size limit is appropriate (default is usually fine)
-- 3. Allowed MIME types include image types 