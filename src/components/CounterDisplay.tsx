import React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {colors} from '../styles/colors';
import {useOrientation} from '../hooks/useOrientation';
import {t} from '../i18n';

const {width, height} = Dimensions.get('window');

interface CounterDisplayProps {
  count: number;
  goal: number | null;
  onGoalPress: () => void;
}

export const CounterDisplay: React.FC<CounterDisplayProps> = ({
  count,
  goal,
  onGoalPress,
}) => {
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  const progress = goal && goal > 0 ? Math.min(count / goal, 1) : null;
  const isGoalReached = goal !== null && goal > 0 && count >= goal;

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <View style={[styles.card, isLandscape && styles.cardLandscape]}>
        <Text style={[styles.label, isLandscape && styles.labelLandscape]}>
          {t('count')}
        </Text>
        <Text
          style={[
            styles.counter,
            isLandscape && styles.counterLandscape,
            isGoalReached && styles.counterGoalReached,
          ]}>
          {count.toString().padStart(3, '0')}
        </Text>

        {progress !== null && (
          <View style={[styles.progressSection, isLandscape && styles.progressSectionLandscape]}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {width: `${progress * 100}%`},
                  isGoalReached && styles.progressBarFillComplete,
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {count} / {goal}
              {isGoalReached ? ' ✓' : ` (${Math.round(progress * 100)}%)`}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.goalButton, isLandscape && styles.goalButtonLandscape]}
          onPress={onGoalPress}
          activeOpacity={0.7}>
          <Text style={[styles.goalButtonText, isLandscape && styles.goalButtonTextLandscape]}>
            {goal ? `🎯 ${t('goal')}: ${goal}` : `🎯 ${t('setGoal')}`}
          </Text>
        </TouchableOpacity>

        <View style={[styles.hint, isLandscape && styles.hintLandscape]}>
          <Text
            style={[styles.hintText, isLandscape && styles.hintTextLandscape]}>
            {t('volumeHint')}
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
  counterGoalReached: {
    color: colors.success,
  },
  progressSection: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  progressSectionLandscape: {
    marginTop: 10,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressBarFillComplete: {
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 6,
  },
  goalButton: {
    marginTop: 14,
    backgroundColor: colors.transparent.primary10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  goalButtonLandscape: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  goalButtonText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  goalButtonTextLandscape: {
    fontSize: 11,
  },
  hint: {
    marginTop: 12,
    backgroundColor: colors.transparent.primary10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hintLandscape: {
    marginTop: 8,
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
