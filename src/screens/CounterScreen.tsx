import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header} from '../components/Header';
import {CounterDisplay} from '../components/CounterDisplay';
import {ControlButtons} from '../components/ControlButtons';
import {CelebrationOverlay} from '../components/CelebrationOverlay';
import {useCounter} from '../hooks/useCounter';
import {useGoal} from '../hooks/useGoal';
import {useVolumeButtons} from '../hooks/useVolumeButtons';
import {useOrientation} from '../hooks/useOrientation';
import {colors} from '../styles/colors';
import {t} from '../i18n';

interface CounterScreenProps {
  onNavigateToHistory: () => void;
  onSaveToHistory: (count: number, label?: string) => void;
}

export const CounterScreen: React.FC<CounterScreenProps> = ({
  onNavigateToHistory,
  onSaveToHistory,
}) => {
  const {count, increment, decrement, reset} = useCounter();
  const {goal, setGoal} = useGoal();
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const prevCountRef = useRef(count);

  useVolumeButtons({
    onVolumeUp: increment,
    onVolumeDown: decrement,
  });

  // Detect goal reached
  useEffect(() => {
    if (
      goal !== null &&
      goal > 0 &&
      count >= goal &&
      prevCountRef.current < goal
    ) {
      setShowCelebration(true);
    }
    prevCountRef.current = count;
  }, [count, goal]);

  const handleGoalPress = () => {
    setGoalInput(goal ? goal.toString() : '');
    setShowGoalModal(true);
  };

  const handleGoalSave = () => {
    const value = parseInt(goalInput, 10);
    if (!isNaN(value) && value > 0) {
      setGoal(value);
    } else {
      setGoal(null);
    }
    setShowGoalModal(false);
  };

  const handleGoalClear = () => {
    setGoal(null);
    setShowGoalModal(false);
  };

  const handleCelebrationFinish = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[styles.safeArea, isLandscape && styles.safeAreaLandscape]}
        edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isLandscape && styles.scrollContentLandscape,
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <Header onHistoryPress={onNavigateToHistory} />
          <CounterDisplay
            count={count}
            goal={goal}
            onGoalPress={handleGoalPress}
          />
          <ControlButtons
            onIncrement={increment}
            onDecrement={decrement}
            onReset={() => {
              if (count > 0) {
                onSaveToHistory(count);
              }
              reset();
            }}
          />
        </ScrollView>
      </SafeAreaView>

      <CelebrationOverlay
        visible={showCelebration}
        onFinish={handleCelebrationFinish}
      />

      <Modal
        visible={showGoalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('setGoal')}</Text>
            <Text style={styles.modalEmoji}>🎯</Text>
            <TextInput
              style={styles.modalInput}
              value={goalInput}
              onChangeText={setGoalInput}
              placeholder={t('goalPlaceholder')}
              placeholderTextColor="rgba(0,0,0,0.3)"
              keyboardType="number-pad"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleGoalSave}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowGoalModal(false)}
                activeOpacity={0.7}>
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              {goal !== null && (
                <TouchableOpacity
                  style={styles.modalClearButton}
                  onPress={handleGoalClear}
                  activeOpacity={0.7}>
                  <Text style={styles.modalClearText}>{t('removeGoal')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleGoalSave}
                activeOpacity={0.7}>
                <Text style={styles.modalSaveText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    width: '80%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  modalEmoji: {
    fontSize: 40,
    marginVertical: 12,
  },
  modalInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.4)',
  },
  modalClearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
  },
  modalClearText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.danger,
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
