import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CounterScreen } from './src/screens/CounterScreen';
import { setI18nConfig } from './src/i18n';

function App() {
  useEffect(() => {
    setI18nConfig();
  }, []);

  return (
    <SafeAreaProvider>
      <CounterScreen />
    </SafeAreaProvider>
  );
}

export default App;