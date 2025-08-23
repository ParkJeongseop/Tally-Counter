import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { CounterDisplay } from '../components/CounterDisplay';
import { ControlButtons } from '../components/ControlButtons';
import { useCounter } from '../hooks/useCounter';
import { useVolumeButtons } from '../hooks/useVolumeButtons';
import { colors } from '../styles/colors';

export const CounterScreen: React.FC = () => {
  const { count, increment, decrement, reset } = useCounter();

  useVolumeButtons({
    onVolumeUp: increment,
    onVolumeDown: decrement,
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <Header />
        <CounterDisplay count={count} />
        <ControlButtons 
          onIncrement={increment}
          onDecrement={decrement}
          onReset={reset}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
});