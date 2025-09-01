import React, { useEffect, useState, useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import StarryBackground from './StarryBackground';
import tigerImage from '../assets/tiger4.png'; // Using tiger4.png as specified
// @ts-ignore - heic2any doesn't have perfect TypeScript definitions
import heic2any from 'heic2any';

interface OnboardingScreen4Props {
  onBack: () => void;
  onProceed: () => void;
}

export default function OnboardingScreen4({ onBack, onProceed }: OnboardingScreen4Props) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
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

  const validateImageFile = (file: File): boolean => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/svg+xml',
      'image/heic',
      'image/heif'
    ];
    
    const allowedExtensions = [
      '.jpg', '.jpeg', '.png', '.webp', '.gif', 
      '.bmp', '.tiff', '.tif', '.svg', '.heic', '.heif'
    ];
    
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    const hasValidMimeType = allowedTypes.includes(file.type.toLowerCase());
    
    return hasValidExtension || hasValidMimeType;
  };

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    if (file.type === 'image/heic' || file.type === 'image/heif' || 
        file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
      
      try {
        console.log('Converting HEIC file to JPEG...');
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8 // Good quality while keeping file size reasonable
        });
        
        // heic2any can return an array or single blob
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        
        // Create a new File object from the converted blob
        const convertedFile = new File(
          [blob], 
          file.name.replace(/\.(heic|heif)$/i, '.jpg'), 
          { type: 'image/jpeg' }
        );
        
        console.log('HEIC conversion successful');
        return convertedFile;
      } catch (error) {
        console.error('HEIC conversion failed:', error);
        throw new Error('Failed to convert HEIC image. Please try a different format.');
      }
    }
    return file;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear previous errors
      setUploadError('');
      
      // Validate file type
      if (!validateImageFile(file)) {
        setUploadError('Please select a valid image file (JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, or HEIC)');
        return;
      }
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      
      // Convert HEIC if needed and read file
      convertHeicToJpeg(file).then(processedFile => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.onerror = () => {
          setUploadError('Error reading file. Please try again.');
        };
        reader.readAsDataURL(processedFile);
      }).catch(() => {
        setUploadError('Error processing image. Please try again.');
      });
    }
  };

  const handleUploadClick = () => {
    setUploadError(''); // Clear any previous errors
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
               style={{ transform: 'translateY(-15px)' }}>
            <div className="bg-white rounded-2xl p-3 md:p-4 shadow-2xl relative w-56 md:w-64 h-20 md:h-24 flex items-center justify-center">
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
                accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.svg,.heic,.heif,image/*"
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2.5 md:py-3 rounded-xl text-base md:text-lg font-semibold hover:bg-gray-300 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-gray-300 flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload
              </button>
              
              {/* Show upload error */}
              {uploadError && (
                <div className="mt-2 text-red-500 text-sm text-center">
                  {uploadError}
                </div>
              )}
              
              {/* Show selected image preview */}
              {selectedImage && (
                <div className="mt-3 flex justify-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                    <img
                      src={selectedImage}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                onClick={onProceed}
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