import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles/colors';
import { useOrientation } from '../hooks/useOrientation';

const { width, height } = Dimensions.get('window');

interface CounterDisplayProps {
  count: number;
}

export const CounterDisplay: React.FC<CounterDisplayProps> = ({ count }) => {
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';
  
  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <View style={[styles.card, isLandscape && styles.cardLandscape]}>
        <Text style={[styles.label, isLandscape && styles.labelLandscape]}>COUNT</Text>
        <Text style={[styles.counter, isLandscape && styles.counterLandscape]}>
          {count.toString().padStart(3, '0')}
        </Text>
        <View style={[styles.hint, isLandscape && styles.hintLandscape]}>
          <Text style={[styles.hintText, isLandscape && styles.hintTextLandscape]}>
            Volume buttons to control
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  containerLandscape: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: colors.transparent.white95,
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
    maxWidth: width * 0.9,
  },
  cardLandscape: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    minWidth: Math.min(height * 0.7, width * 0.5),
    maxHeight: height * 0.6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 3,
    marginBottom: 10,
  },
  labelLandscape: {
    fontSize: 12,
    marginBottom: 5,
  },
  counter: {
    fontSize: 84,
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: -2,
    includeFontPadding: false,
  },
  counterLandscape: {
    fontSize: 60,
  },
  hint: {
    marginTop: 20,
    backgroundColor: colors.transparent.primary10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hintLandscape: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hintText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  hintTextLandscape: {
    fontSize: 10,
  },
});