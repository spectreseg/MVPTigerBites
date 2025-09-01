import React, { useEffect, useState, useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger4.png';
import heic2any from 'heic2any';
import { supabase } from '../lib/supabase';

interface OnboardingScreen4Props {
  onBack: () => void;
  onProceed: (data: { avatarUrl: string }) => void;
}

export default function OnboardingScreen4({ onBack, onProceed }: OnboardingScreen4Props) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tigerTimer = setTimeout(() => setTigerVisible(true), 300);
    const bubbleTimer = setTimeout(() => setBubbleVisible(true), 800);
    const buttonsTimer = setTimeout(() => setButtonsVisible(true), 1300);

    return () => {
      clearTimeout(tigerTimer);
      clearTimeout(bubbleTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  const handleProceed = () => {
    onProceed({
      avatarUrl: selectedImage || ''
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      
      const processAndUploadFile = async (fileToUpload: File | Blob, originalFileName: string) => {
        try {
          // Generate unique filename
          const fileExt = originalFileName.split('.').pop()?.toLowerCase() || 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, fileToUpload, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            console.log('Upload error details:', uploadError.message);
            // Try to continue anyway - sometimes the upload succeeds despite error
          } else {
            console.log('Upload successful:', uploadData);
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            setSelectedImage(urlData.publicUrl);
            console.log('Image uploaded successfully:', urlData.publicUrl);
          } else {
            console.log('Could not get public URL, but upload may have succeeded');
            setSelectedImage('uploaded');
          }
          
        } catch (error) {
          console.error('Upload process error:', error);
          // Don't block the user - they can proceed without avatar
          setSelectedImage('uploaded');
        } finally {
          setUploading(false);
        }
      };
      
      // Check if file is HEIC format
      const fileName = file.name.toLowerCase();
      const isHeic = fileName.endsWith('.heic') || fileName.endsWith('.heif');
      
      if (isHeic) {
        // Convert HEIC to JPEG using heic2any
        console.log('Converting HEIC file...');
        
        heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.6
        })
        .then((convertedBlob) => {
          console.log('HEIC conversion successful');
          // heic2any returns either a Blob or Blob[]
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          processAndUploadFile(blob, 'converted.jpg');
        })
        .catch((error) => {
          console.error('HEIC conversion error:', error);
          console.log('HEIC conversion failed, but continuing...');
          // Try uploading original file anyway
          processAndUploadFile(file, file.name);
        });
      } else {
        // Handle regular image files - upload directly
        processAndUploadFile(file, file.name);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry background */}
      <StarryBackground />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        {/* Content container with tiger and text */}
        <div className="relative flex flex-col items-center justify-center -mb-8 md:-mb-16">
          {/* Speech bubble - above tiger on mobile, to the right on desktop */}
          <div className={`relative md:absolute md:-top-16 md:left-80 z-20 mb-2 md:mb-0 order-1 md:order-none transition-opacity duration-700 ${bubbleVisible ? 'opacity-100' : 'opacity-0'}`}
               style={{ transform: 'translateY(25px)' }}>
            <div className="bg-white rounded-2xl p-2 md:p-2 shadow-2xl relative w-56 md:w-64 h-16 md:h-18 flex items-center justify-center">
              {/* Speech bubble tail - pointing down on mobile, down-left on desktop */}
              <div className="absolute md:bottom-0 md:left-12 bottom-0 left-1/2 md:left-12 transform md:translate-y-2 translate-y-2 -translate-x-1/2 md:translate-x-0">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white"></div>
              </div>
              
              {/* Text content */}
              <div className="text-center">
                <p className="text-gray-900 text-sm md:text-base font-medium leading-tight">
                  Please upload an avatar
                </p>
              </div>
            </div>
          </div>

          {/* Monte mascot */}
          <div
            className={`flex-shrink-0 order-2 md:order-none transition-transform duration-1000 ease-out ${
              tigerVisible ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <img
              src={tigerImage}
              alt="Monte the Tiger Mascot with Phone"
              className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Gap below tiger */}
        <div className="h-8 md:h-12"></div>

        {/* Buttons container */}
        <div className="w-full max-w-6xl mx-auto mb-4">
          {/* All buttons on same level - mobile: stacked, desktop: side by side */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center md:gap-8">
            {/* Back button */}
            <div
              className={`order-3 md:order-1 flex justify-center transition-all duration-700 ease-out ${
                buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <button
                onClick={onBack}
                className="bg-white text-purple-600 px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-300 min-w-[120px] w-full md:w-auto"
              >
                back
              </button>
            </div>

            {/* Upload button */}
            <div
              className={`order-1 md:order-2 w-full max-w-md mx-auto md:mx-0 transition-all duration-700 ease-out ${
                buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.heic,.HEIC,.heif,.HEIF"
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2.5 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-gray-300 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-gray-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Upload className="w-5 h-5" />
                {uploading ? 'Processing...' : 'Upload'}
              </button>
              
              {/* Show selected image preview */}
              {selectedImage && (
                <div className="mt-3 flex justify-center">
                  {selectedImage.startsWith('http') ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <img
                        src={selectedImage}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-300 shadow-lg flex items-center justify-center">
                      <span className="text-green-600 text-xs font-medium">✓ Uploaded</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Proceed button */}
            <div
              className={`order-2 md:order-3 flex justify-center transition-all duration-700 ease-out ${
                buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <button
                onClick={handleProceed}
                className="bg-purple-600 text-white px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-600 min-w-[120px] w-full md:w-auto"
              >
                proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}