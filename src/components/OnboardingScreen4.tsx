import React, { useEffect, useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger4.png';
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
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [avatarPath, setAvatarPath] = useState<string>('');
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Simple file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to user-avatars bucket
      const { error } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file);

      if (error) throw error;

      setAvatarPath(filePath);
      setUploadSuccess(true);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setSelectedImage(null);
      setAvatarPath('');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProceed = () => {
    onProceed({ avatarUrl: avatarPath });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <StarryBackground />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        {/* Content container with tiger and text */}
        <div className="relative flex flex-col items-center justify-center -mb-8 md:-mb-16">
          {/* Speech bubble */}
          <div className={`relative md:absolute md:-top-16 md:left-80 z-20 mb-2 md:mb-0 order-1 md:order-none transition-opacity duration-700 ${bubbleVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl p-2 md:p-3 shadow-2xl relative w-56 md:w-64 h-16 md:h-18 flex items-center justify-center">
              <div className="absolute bottom-0 left-1/2 md:left-12 transform translate-y-2 -translate-x-1/2 md:translate-x-0">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white" />
              </div>
              
              <div className="text-center">
                <p className="text-gray-900 text-sm md:text-base font-medium leading-tight">
                  Please upload an avatar
                </p>
              </div>
            </div>
          </div>

          {/* Monte mascot */}
          <div className={`flex-shrink-0 order-2 md:order-none transition-transform duration-1000 ease-out ${tigerVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <img
              src={tigerImage}
              alt="Monte the Tiger Mascot with Phone"
              className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="h-8 md:h-12"></div>

        {/* Buttons container */}
        <div className="w-full max-w-6xl mx-auto mb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center md:gap-8">
            
            {/* Back button */}
            <div className={`order-3 md:order-1 flex justify-center transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <button
                onClick={onBack}
                className="bg-white text-purple-600 px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-300 min-w-[120px] w-full md:w-auto"
              >
                Back
              </button>
            </div>

            {/* Upload section */}
            <div className={`order-1 md:order-2 w-full max-w-md mx-auto md:mx-0 transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2.5 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-gray-300 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-gray-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                {uploading ? 'Uploading...' : uploadSuccess ? 'Change Avatar' : 'Upload Avatar'}
              </button>
              
              {/* Status */}
              {uploading && (
                <div className="mt-3 text-center">
                  <div className="text-blue-400 text-sm">Processing...</div>
                </div>
              )}
              
              {uploadSuccess && selectedImage && (
                <div className="mt-3 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img src={selectedImage} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-green-400 text-sm mt-2">✓ Ready to proceed!</p>
                </div>
              )}
            </div>

            {/* Proceed button */}
            <div className={`order-2 md:order-3 flex justify-center transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <button
                onClick={handleProceed}
                className="bg-purple-600 text-white px-8 py-2.5 md:px-10 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-purple-600 min-w-[120px] w-full md:w-auto"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}