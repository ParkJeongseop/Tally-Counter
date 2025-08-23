import React from 'react';
import { View, StatusBar, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { CounterDisplay } from '../components/CounterDisplay';
import { ControlButtons } from '../components/ControlButtons';
import { useCounter } from '../hooks/useCounter';
import { useVolumeButtons } from '../hooks/useVolumeButtons';
import { useOrientation } from '../hooks/useOrientation';
import { colors } from '../styles/colors';

export const CounterScreen: React.FC = () => {
  const { count, increment, decrement, reset } = useCounter();
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  useVolumeButtons({
    onVolumeUp: increment,
    onVolumeDown: decrement,
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={[styles.safeArea, isLandscape && styles.safeAreaLandscape]} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, isLandscape && styles.scrollContentLandscape]}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <Header />
          <CounterDisplay count={count} />
          <ControlButtons 
            onIncrement={increment}
            onDecrement={decrement}
            onReset={reset}
          />
        </ScrollView>
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
  safeAreaLandscape: {
    paddingHorizontal: 40,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  scrollContentLandscape: {
    justifyContent: 'center',
  },
});