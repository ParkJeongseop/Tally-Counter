import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Vibration,
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { VolumeManager } = NativeModules;
const STORAGE_KEY = '@tally_counter_value';
const { width, height } = Dimensions.get('window');

function CounterContent() {
  const [count, setCount] = useState(0);

  // Load saved count on app start
  useEffect(() => {
    const loadCount = async () => {
      try {
        const savedCount = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCount !== null) {
          setCount(parseInt(savedCount, 10));
          console.log('Loaded saved count:', savedCount);
        }
      } catch (error) {
        console.error('Error loading count:', error);
      }
    };
    loadCount();
  }, []);

  // Save count whenever it changes
  useEffect(() => {
    const saveCount = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, count.toString());
        console.log('Saved count:', count);
      } catch (error) {
        console.error('Error saving count:', error);
      }
    };
    saveCount();
  }, [count]);

  useEffect(() => {
    console.log('Setting up volume button listeners for', Platform.OS);
    
    if (Platform.OS === 'android') {
      const volumeUpListener = DeviceEventEmitter.addListener('VolumeUp', () => {
        console.log('Volume Up pressed');
        setCount(prev => {
          const newCount = prev + 1;
          console.log('Count increased to:', newCount);
          return newCount;
        });
        Vibration.cancel();
        Vibration.vibrate(10);
      });

      const volumeDownListener = DeviceEventEmitter.addListener('VolumeDown', () => {
        console.log('Volume Down pressed');
        setCount(prev => {
          const newCount = Math.max(0, prev - 1);
          console.log('Count decreased to:', newCount);
          return newCount;
        });
        Vibration.cancel();
        Vibration.vibrate(10);
      });

      return () => {
        volumeUpListener.remove();
        volumeDownListener.remove();
      };
    } else if (Platform.OS === 'ios' && VolumeManager) {
      const volumeManagerEmitter = new NativeEventEmitter(VolumeManager);
      
      const volumeUpListener = volumeManagerEmitter.addListener('RNVMEventVolume', (data) => {
        console.log('Volume changed:', data);
        if (data.volume > 0.5) {
          console.log('Volume Up detected');
          setCount(prev => {
            const newCount = prev + 1;
            console.log('Count increased to:', newCount);
            return newCount;
          });
          Vibration.cancel();
          Vibration.vibrate(1);
          setTimeout(() => {
            VolumeManager.setVolume(0.5);
          }, 10);
        } else if (data.volume < 0.5) {
          console.log('Volume Down detected');
          setCount(prev => {
            const newCount = Math.max(0, prev - 1);
            console.log('Count decreased to:', newCount);
            return newCount;
          });
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
        volumeUpListener.remove();
      };
    }
  }, []);

  const increment = () => {
    setCount(count + 1);
    Vibration.cancel();
    Vibration.vibrate(10);
  };

  const decrement = () => {
    setCount(Math.max(0, count - 1));
    Vibration.cancel();
    Vibration.vibrate(10);
  };

  const reset = () => {
    setCount(0);
    Vibration.cancel();
    Vibration.vibrate(30);
  };

  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tally Counter</Text>
          <Text style={styles.subtitle}>Track anything, anytime</Text>
        </View>
        
        {/* Counter Display */}
        <View style={styles.counterSection}>
          <View style={styles.counterCard}>
            <Text style={styles.counterLabel}>COUNT</Text>
            <Text style={styles.counter}>{count.toString().padStart(3, '0')}</Text>
            <View style={styles.volumeHint}>
              <Text style={styles.volumeHintText}>Volume buttons to control</Text>
            </View>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlSection}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.decrementButton]} 
            onPress={decrement}
            activeOpacity={0.8}>
            <View style={styles.buttonInner}>
              <Text style={styles.buttonIcon}>−</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.resetButton]} 
            onPress={reset}
            activeOpacity={0.8}>
            <View style={styles.resetButtonInner}>
              <Text style={styles.resetIcon}>↺</Text>
              <Text style={styles.resetText}>RESET</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.incrementButton]} 
            onPress={increment}
            activeOpacity={0.8}>
            <View style={styles.buttonInner}>
              <Text style={styles.buttonIcon}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <CounterContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  counterSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  counterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    minWidth: width * 0.8,
  },
  counterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667eea',
    letterSpacing: 3,
    marginBottom: 10,
  },
  counter: {
    fontSize: 84,
    fontWeight: '900',
    color: '#2D3748',
    letterSpacing: -2,
    includeFontPadding: false,
  },
  volumeHint: {
    marginTop: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  volumeHintText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  controlSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  controlButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonInner: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButton: {
    backgroundColor: '#EF4444',
    borderRadius: 37.5,
  },
  incrementButton: {
    backgroundColor: '#10B981',
    borderRadius: 37.5,
  },
  buttonIcon: {
    fontSize: 40,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resetButtonInner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

export default App;