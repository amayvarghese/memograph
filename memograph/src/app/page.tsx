'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCamera } from '@/hooks/useCamera';
import { useOrientation } from '@/hooks/useOrientation';
import { CameraFeed } from '@/components/CameraFeed';
import { CompassUI } from '@/components/CompassUI';

// 12 target angles for 360° capture (0°, 30°, 60°, ..., 330°)
const TARGET_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
const ALIGNMENT_TOLERANCE = 5; // ±5° tolerance for alignment

export default function CapturePage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const { videoRef, canvasRef, stream, error: cameraError, startCamera, captureImage, stopCamera } = useCamera();
  const { heading, error: orientationError, requestPermission, isSupported } = useOrientation();

  const currentTargetAngle = TARGET_ANGLES[currentTargetIndex];
  const capturedAngles = capturedImages.map((_, index) => TARGET_ANGLES[index]);

  // Check if user is aligned with current target
  const isAligned = Math.abs(heading - currentTargetAngle) <= ALIGNMENT_TOLERANCE ||
                   Math.abs(heading - currentTargetAngle - 360) <= ALIGNMENT_TOLERANCE ||
                   Math.abs(heading - currentTargetAngle + 360) <= ALIGNMENT_TOLERANCE;

  // Request all permissions
  const requestAllPermissions = useCallback(async () => {
    try {
      // Request orientation permission first
      const orientationGranted = await requestPermission();
      
      if (!orientationGranted) {
        alert('Orientation permission is required for this app to work properly.');
        return;
      }

      // Start camera
      await startCamera();
      setPermissionsGranted(true);
    } catch (error) {
      console.error('Permission request failed:', error);
      alert('Failed to request permissions. Please try again.');
    }
  }, [requestPermission, startCamera]);

  // Capture image when aligned
  const handleCapture = useCallback(() => {
    if (!isAligned || !captureImage) return;

    const imageData = captureImage();
    if (imageData) {
      setCapturedImages(prev => [...prev, imageData]);
      setCurrentTargetIndex(prev => prev + 1);
    }
  }, [isAligned, captureImage]);

  // Upload images when all 12 are captured
  const uploadImages = useCallback(async () => {
    if (capturedImages.length !== 12) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: capturedImages }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Navigate to viewer with the panorama URL
        router.push(`/viewer?url=${encodeURIComponent(result.url)}`);
      } else {
        alert('Failed to process images. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images. Please try again.');
      setIsProcessing(false);
    }
  }, [capturedImages, router]);

  // Auto-upload when all images are captured
  useEffect(() => {
    if (capturedImages.length === 12) {
      uploadImages();
    }
  }, [capturedImages.length, uploadImages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const isComplete = capturedImages.length === 12;
  const canCapture = isAligned && !isComplete && permissionsGranted && !isProcessing;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Memograph</h1>
          <p className="text-gray-600 text-sm">
            Capture 12 images in a 360° circle to create your panorama
          </p>
        </div>

        {/* Camera Feed */}
        <div className="mb-6">
          <CameraFeed
            videoRef={videoRef}
            canvasRef={canvasRef}
            isActive={!!stream}
            error={cameraError}
          />
        </div>

        {/* Compass UI */}
        <div className="mb-6">
          <CompassUI
            heading={heading}
            targetAngle={currentTargetAngle}
            capturedAngles={capturedAngles}
            isAligned={isAligned}
          />
        </div>

        {/* Permission Request */}
        {!permissionsGranted && (
          <div className="text-center mb-6">
            <button
              onClick={requestAllPermissions}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Grant Permissions & Start
            </button>
            {!isSupported && (
              <p className="text-red-600 text-sm mt-2">
                Device orientation is not supported on this device
              </p>
            )}
            {orientationError && (
              <p className="text-red-600 text-sm mt-2">{orientationError}</p>
            )}
          </div>
        )}

        {/* Capture Button */}
        {permissionsGranted && !isComplete && (
          <div className="text-center mb-6">
            <button
              onClick={handleCapture}
              disabled={!canCapture}
              className={`px-8 py-4 rounded-lg font-medium text-lg transition-all ${
                canCapture
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAligned ? '📸 Capture' : '🎯 Align First'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              {isAligned ? 'Ready to capture!' : 'Rotate to the orange dot'}
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{capturedImages.length}/12</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(capturedImages.length / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Thumbnail Strip */}
        {capturedImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Captured Images</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {capturedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Capture ${index + 1}`}
                  className="w-16 h-12 object-cover rounded border-2 border-green-500 flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Processing your 360° panorama...</p>
          </div>
        )}

        {/* Complete State */}
        {isComplete && !isProcessing && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600">All images captured! Processing...</p>
          </div>
        )}
      </div>
    </div>
  );
}