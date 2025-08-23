import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { useOrientation } from '../hooks/useOrientation';
import { t } from '../i18n';

export const Header: React.FC = () => {
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';
  
  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
        {t('appTitle')}
      </Text>
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
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  titleLandscape: {
    fontSize: 24,
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    color: colors.transparent.white80,
    fontWeight: '500',
  },
});