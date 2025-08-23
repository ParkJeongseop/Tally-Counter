import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
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
} from 'react-native';

const { VolumeManager } = NativeModules;

function App() {
  const [count, setCount] = useState(0);

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
    Vibration.vibrate(1);
  };

  const decrement = () => {
    setCount(Math.max(0, count - 1));
    Vibration.cancel();
    Vibration.vibrate(1);
  };

  const reset = () => {
    setCount(0);
    Vibration.cancel();
    Vibration.vibrate(5);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      <View style={styles.header}>
        <Text style={styles.title}>Tally Counter</Text>
        <Text style={styles.subtitle}>Use volume buttons or tap</Text>
      </View>
      
      <View style={styles.counterContainer}>
        <Text style={styles.counter}>{count}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.decrementButton]} onPress={decrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.incrementButton]} onPress={increment}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Volume Up: +1 | Volume Down: -1</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  subtitle: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 5,
  },
  counterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  incrementButton: {
    backgroundColor: '#27ae60',
  },
  decrementButton: {
    backgroundColor: '#e74c3c',
  },
  resetButton: {
    backgroundColor: '#2c3e50',
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  buttonText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  resetText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#95a5a6',
  },
});

export default App;