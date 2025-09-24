'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseOrientationReturn {
  heading: number;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  isSupported: boolean;
}

export const useOrientation = (): UseOrientationReturn => {
  const [heading, setHeading] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    // Check if device orientation is supported
    const supported = 'DeviceOrientationEvent' in window;
    setIsSupported(supported);

    if (!supported) {
      setError('Device orientation is not supported on this device');
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Normalize the heading to 0-360 range
        let normalizedHeading = event.alpha;
        if (normalizedHeading < 0) {
          normalizedHeading += 360;
        }
        setHeading(normalizedHeading);
      }
    };

    // Add event listener
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Device orientation is not supported');
      return false;
    }

    try {
      // For iOS 13+, we need to request permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setError(null);
          return true;
        } else {
          setError('Device orientation permission denied');
          return false;
        }
      } else {
        // For other browsers, assume permission is granted
        setError(null);
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request orientation permission';
      setError(errorMessage);
      return false;
    }
  }, [isSupported]);

  return {
    heading,
    error,
    requestPermission,
    isSupported
  };
};
