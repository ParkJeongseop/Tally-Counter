import { useEffect } from 'react';
import {
  Platform,
  Vibration,
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native';

const { VolumeManager } = NativeModules;

interface UseVolumeButtonsProps {
  onVolumeUp: () => void;
  onVolumeDown: () => void;
}

export const useVolumeButtons = ({ onVolumeUp, onVolumeDown }: UseVolumeButtonsProps) => {
  useEffect(() => {
    console.log('Setting up volume button listeners for', Platform.OS);
    
    if (Platform.OS === 'android') {
      const volumeUpListener = DeviceEventEmitter.addListener('VolumeUp', () => {
        console.log('Volume Up pressed');
        onVolumeUp();
        Vibration.cancel();
        Vibration.vibrate(10);
      });

      const volumeDownListener = DeviceEventEmitter.addListener('VolumeDown', () => {
        console.log('Volume Down pressed');
        onVolumeDown();
        Vibration.cancel();
        Vibration.vibrate(10);
      });

      return () => {
        volumeUpListener.remove();
        volumeDownListener.remove();
      };
    } else if (Platform.OS === 'ios' && VolumeManager) {
      const volumeManagerEmitter = new NativeEventEmitter(VolumeManager);
      
      const volumeListener = volumeManagerEmitter.addListener('RNVMEventVolume', (data) => {
        console.log('Volume changed:', data);
        if (data.volume > 0.5) {
          console.log('Volume Up detected');
          onVolumeUp();
          Vibration.cancel();
          Vibration.vibrate(1);
          setTimeout(() => {
            VolumeManager.setVolume(0.5);
          }, 10);
        } else if (data.volume < 0.5) {
          console.log('Volume Down detected');
          onVolumeDown();
          Vibration.cancel();
          Vibration.vibrate(1);
          setTimeout(() => {
            VolumeManager.setVolume(0.5);
          }, 10);
        }
      });

      VolumeManager.setVolume(0.5);
      if (VolumeManager.hideVolumeView) {
        VolumeManager.hideVolumeView();
      }

      return () => {
        volumeListener.remove();
      };
    }
  }, [onVolumeUp, onVolumeDown]);
};