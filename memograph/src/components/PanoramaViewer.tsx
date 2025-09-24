'use client';

import React from 'react';
import { Pannellum } from 'pannellum-react';

interface PanoramaViewerProps {
  imageUrl: string;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl }) => {
  return (
    <div className="w-full h-screen">
      <Pannellum
        width="100%"
        height="100%"
        image={imageUrl}
        pitch={0}
        yaw={0}
        hfov={100}
        autoLoad
        autoRotate={-2}
        compass={true}
        showControls={true}
        showFullscreenCtrl={true}
        showZoomCtrl={true}
        keyboardZoom={true}
        mouseZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        orientationOnByDefault={false}
        draggable={true}
        disableKeyboardCtrl={false}
        showInfoCtrl={true}
        showNavCtrl={true}
        hotSpots={[]}
        onLoad={() => {
          console.log('Panorama loaded successfully');
        }}
        onError={(error) => {
          console.error('Panorama error:', error);
        }}
      />
    </div>
  );
};
