import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tally Counter</Text>
      <Text style={styles.subtitle}>Track anything, anytime</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.transparent.white80,
    fontWeight: '500',
  },
});