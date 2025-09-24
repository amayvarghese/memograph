'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PanoramaViewer } from '@/components/PanoramaViewer';

function ViewerContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('url') || '/placeholder-360.jpg';

  return (
    <div className="w-full h-screen">
      <PanoramaViewer imageUrl={imageUrl} />
    </div>
  );
}

export default function ViewerPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-400 rounded-full animate-spin"></div>
          <p>Loading 360° viewer...</p>
        </div>
      </div>
    }>
      <ViewerContent />
    </Suspense>
  );
}
