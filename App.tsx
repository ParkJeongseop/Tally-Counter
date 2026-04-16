import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CounterScreen } from './src/screens/CounterScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { useHistory } from './src/hooks/useHistory';
import { setI18nConfig } from './src/i18n';

function App() {
  const [showHistory, setShowHistory] = useState(false);
  const { history, isLoading, addRecord, deleteRecord, updateLabel, clearAllHistory } = useHistory();

  useEffect(() => {
    setI18nConfig();
  }, []);

  return (
    <SafeAreaProvider>
      {showHistory ? (
        <HistoryScreen
          history={history}
          isLoading={isLoading}
          onDelete={deleteRecord}
          onUpdateLabel={updateLabel}
          onClearAll={clearAllHistory}
          onBack={() => setShowHistory(false)}
        />
      ) : (
        <CounterScreen
          onNavigateToHistory={() => setShowHistory(true)}
          onSaveToHistory={addRecord}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;