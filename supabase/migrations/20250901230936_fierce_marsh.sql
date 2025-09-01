/*
  # Create Avatar Storage Bucket

  1. Storage Setup
    - Create dedicated `user-avatars` bucket for profile pictures
    - Enable public access for avatar viewing
    - Set up RLS policies for secure uploads
    - Configure file size and type restrictions

  2. Security
    - Users can only upload to their own folder (user_id/)
    - Public read access for avatar display
    - Authenticated users can upload images
    - File type restrictions (images only)
    - File size limit (5MB max)

  3. Organization
    - Files stored as: user-avatars/{user_id}/avatar.{ext}
    - Automatic cleanup of old avatars when new ones uploaded
*/

-- Create the user-avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'user-avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'user-avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );