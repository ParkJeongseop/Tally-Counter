import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { useOrientation } from '../hooks/useOrientation';
import { t } from '../i18n';

interface HeaderProps {
  onHistoryPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHistoryPress }) => {
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <View style={styles.titleRow}>
        <View style={styles.spacer} />
        <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
          {t('appTitle')}
        </Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={onHistoryPress}
          activeOpacity={0.7}>
          <Text style={styles.historyIcon}>📋</Text>
        </TouchableOpacity>
      </View>
      {!isLandscape && (
        <Text style={styles.subtitle}>{t('subtitle')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  containerLandscape: {
    paddingTop: 10,
    paddingBottom: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  spacer: {
    width: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
    flex: 1,
    textAlign: 'center',
  },
  titleLandscape: {
    fontSize: 24,
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.transparent.white20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyIcon: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
    color: colors.transparent.white80,
    fontWeight: '500',
  },
});