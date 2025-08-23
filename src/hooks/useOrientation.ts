import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    const { width, height } = Dimensions.get('window');
    return width < height ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width < height ? 'portrait' : 'landscape');
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      subscription?.remove();
    };
  }, []);

  return orientation;
};