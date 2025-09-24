'use client';

import React from 'react';

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  error?: string | null;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  videoRef,
  canvasRef,
  isActive,
  error
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${!isActive ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          playsInline
          muted
        />
        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-400 rounded-full animate-pulse"></div>
              <p className="text-sm">Starting camera...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900">
            <div className="text-white text-center p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">Camera Error</p>
              <p className="text-xs mt-1 opacity-75">{error}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for image capture */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
};
