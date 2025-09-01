/*
  # Setup Avatar Storage

  1. Storage Setup
    - Create `avatars` bucket (private)
    - Enable proper RLS policies for user-scoped uploads

  2. Security
    - Users can only upload to their own folder (uid-based)
    - Users can only read their own files
    - Proper file path validation using storage.foldername()
*/

-- Create the avatars bucket (private by default)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (should already be enabled, but ensuring)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own files
CREATE POLICY "users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own files
CREATE POLICY "users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);