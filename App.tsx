import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CounterScreen } from './src/screens/CounterScreen';

function App() {
  return (
    <SafeAreaProvider>
      <CounterScreen />
    </SafeAreaProvider>
  );
}

export default App;