/*
  # Create avatars storage bucket

  1. Storage Setup
    - Create `avatars` bucket for user profile images
    - Enable public access for avatar images
    - Set up RLS policies for avatar uploads

  2. Security
    - Users can upload their own avatars
    - Public read access for avatar images
    - Authenticated users can update their own avatars
*/

-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');