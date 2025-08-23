import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles/colors';

const { width } = Dimensions.get('window');

interface CounterDisplayProps {
  count: number;
}

export const CounterDisplay: React.FC<CounterDisplayProps> = ({ count }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>COUNT</Text>
        <Text style={styles.counter}>{count.toString().padStart(3, '0')}</Text>
        <View style={styles.hint}>
          <Text style={styles.hintText}>Volume buttons to control</Text>
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
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 3,
    marginBottom: 10,
  },
  counter: {
    fontSize: 84,
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: -2,
    includeFontPadding: false,
  },
  hint: {
    marginTop: 20,
    backgroundColor: colors.transparent.primary10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hintText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});