import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { colors } from '../styles/colors';

interface ControlButtonsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onIncrement,
  onDecrement,
  onReset,
}) => {
  const handleIncrement = () => {
    onIncrement();
    Vibration.cancel();
    Vibration.vibrate(10);
  };

  const handleDecrement = () => {
    onDecrement();
    Vibration.cancel();
    Vibration.vibrate(10);
  };

  const handleReset = () => {
    onReset();
    Vibration.cancel();
    Vibration.vibrate(30);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.decrementButton]} 
        onPress={handleDecrement}
        activeOpacity={0.8}>
        <View style={styles.buttonInner}>
          <Text style={styles.buttonIcon}>−</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.resetButton]} 
        onPress={handleReset}
        activeOpacity={0.8}>
        <View style={styles.resetButtonInner}>
          <Text style={styles.resetIcon}>↺</Text>
          <Text style={styles.resetText}>RESET</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.incrementButton]} 
        onPress={handleIncrement}
        activeOpacity={0.8}>
        <View style={styles.buttonInner}>
          <Text style={styles.buttonIcon}>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  button: {
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
    backgroundColor: colors.danger,
    borderRadius: 37.5,
  },
  incrementButton: {
    backgroundColor: colors.success,
    borderRadius: 37.5,
  },
  buttonIcon: {
    fontSize: 40,
    fontWeight: '300',
    color: colors.white,
  },
  resetButton: {
    backgroundColor: colors.transparent.white20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.transparent.white30,
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
    color: colors.white,
    fontWeight: '600',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
});