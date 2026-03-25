'use client';

import { useState, useRef } from 'react';
import ImageUploader from '@/components/ImageUploader';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove background: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultImage(url);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (dataUrl: string) => {
    setOriginalImage(dataUrl);
    setResultImage(null); // 清除之前的结果
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Image Background Remover
        </h1>
        <p className="text-gray-600">
          Upload an image and get a transparent PNG with background removed instantly.
        </p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Upload and original */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h2>
            <ImageUploader 
              onUpload={handleUpload}
              onImageSelect={handleImageSelect}
              disabled={loading}
            />
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Supported formats:</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>JPG, PNG, WebP</li>
                <li>Maximum file size: 5MB</li>
                <li>Recommended: Images with clear foreground objects</li>
              </ul>
            </div>
          </div>

          {originalImage && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Original Image</h2>
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right column: Result */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Result</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-600">Processing image... This may take a few seconds.</p>
            </div>
          ) : resultImage ? (
            <div className="space-y-6">
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={resultImage} 
                  alt="Background removed" 
                  className="w-full h-full object-contain"
                />
                {/* 网格背景用于显示透明度 */}
                <div className="absolute inset-0 opacity-10 bg-[length:20px_20px] bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[position:0_0,10px_10px]"></div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href={resultImage}
                  download="background-removed.png"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Download PNG
                </a>
                <button
                  onClick={() => {
                    setOriginalImage(null);
                    setResultImage(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Process Another Image
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>The background has been removed. The downloaded image will have a transparent background (PNG format).</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-4">
              <div className="text-5xl">🖼️</div>
              <p className="text-lg">Processed image will appear here</p>
              <p className="text-sm">Upload an image to see the magic!</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Powered by Remove.bg API • Built with Next.js • Deployed on Cloudflare Pages</p>
        <p className="mt-2">Free tier: 50 images per month • For personal use only</p>
      </footer>
    </div>
  );
}