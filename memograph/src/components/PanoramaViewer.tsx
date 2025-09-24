'use client';

import React from 'react';

interface PanoramaViewerProps {
  imageUrl: string;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl }) => {
  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">360° Panorama Viewer</h2>
          <p className="text-gray-300 mb-4">
            Your panorama has been captured successfully!
          </p>
        </div>
        
        <div className="mb-6">
          <img 
            src={imageUrl} 
            alt="360° Panorama" 
            className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
          />
        </div>
        
        <div className="text-sm text-gray-400">
          <p className="mb-2">🎉 Congratulations! You&apos;ve captured a 360° panorama</p>
          <p className="mb-4">In a full implementation, this would show an interactive 360° viewer</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Capture
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
