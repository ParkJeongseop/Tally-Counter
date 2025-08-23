import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { colors } from '../styles/colors';
import { useOrientation } from '../hooks/useOrientation';

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
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';
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
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <TouchableOpacity 
        style={[
          styles.button, 
          styles.decrementButton,
          isLandscape && styles.buttonLandscape
        ]} 
        onPress={handleDecrement}
        activeOpacity={0.8}>
        <View style={[styles.buttonInner, isLandscape && styles.buttonInnerLandscape]}>
          <Text style={[styles.buttonIcon, isLandscape && styles.buttonIconLandscape]}>−</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.button, 
          styles.resetButton,
          isLandscape && styles.resetButtonLandscape
        ]} 
        onPress={handleReset}
        activeOpacity={0.8}>
        <View style={[styles.resetButtonInner, isLandscape && styles.resetButtonInnerLandscape]}>
          <Text style={[styles.resetIcon, isLandscape && styles.resetIconLandscape]}>↺</Text>
          <Text style={[styles.resetText, isLandscape && styles.resetTextLandscape]}>RESET</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.button, 
          styles.incrementButton,
          isLandscape && styles.buttonLandscape
        ]} 
        onPress={handleIncrement}
        activeOpacity={0.8}>
        <View style={[styles.buttonInner, isLandscape && styles.buttonInnerLandscape]}>
          <Text style={[styles.buttonIcon, isLandscape && styles.buttonIconLandscape]}>+</Text>
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
  containerLandscape: {
    paddingVertical: 15,
    paddingBottom: 20,
    gap: 15,
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
  buttonInnerLandscape: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  buttonLandscape: {
    borderRadius: 30,
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
  buttonIconLandscape: {
    fontSize: 32,
  },
  resetButton: {
    backgroundColor: colors.transparent.white20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.transparent.white30,
  },
  resetButtonLandscape: {
    borderRadius: 20,
  },
  resetButtonInner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButtonInnerLandscape: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 6,
  },
  resetIcon: {
    fontSize: 20,
    color: colors.white,
    fontWeight: '600',
  },
  resetIconLandscape: {
    fontSize: 16,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
  resetTextLandscape: {
    fontSize: 12,
  },
});