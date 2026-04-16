import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HistoryRecord} from '../types/history';
import {HistoryItem} from '../components/HistoryItem';
import {useOrientation} from '../hooks/useOrientation';
import {colors} from '../styles/colors';
import {t} from '../i18n';

interface HistoryScreenProps {
  history: HistoryRecord[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
  onClearAll: () => void;
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  isLoading,
  onDelete,
  onUpdateLabel,
  onClearAll,
  onBack,
}) => {
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  const handleClearAll = () => {
    Alert.alert(t('confirmClearAll'), undefined, [
      {text: t('cancel'), style: 'cancel'},
      {
        text: t('delete'),
        style: 'destructive',
        onPress: onClearAll,
      },
    ]);
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyText}>{t('noHistory')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[styles.safeArea, isLandscape && styles.safeAreaLandscape]}
        edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

        <View style={[styles.header, isLandscape && styles.headerLandscape]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
          <Text
            style={[styles.title, isLandscape && styles.titleLandscape]}>
            {t('history')}
          </Text>
          {history.length > 0 ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
              activeOpacity={0.7}>
              <Text style={styles.clearText}>{t('clearAll')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>

        {isLoading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator color={colors.white} size="large" />
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <HistoryItem record={item} onDelete={onDelete} onUpdateLabel={onUpdateLabel} />
            )}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={[
              styles.listContent,
              history.length === 0 && styles.listContentEmpty,
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 20,
  },
  headerLandscape: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
  },
  backArrow: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '300',
  },
  backText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  titleLandscape: {
    fontSize: 20,
  },
  clearButton: {
    backgroundColor: colors.transparent.white20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.transparent.white30,
    minWidth: 70,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '700',
  },
  headerSpacer: {
    minWidth: 70,
  },
  listContent: {
    paddingBottom: 20,
  },
  listContentEmpty: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 18,
    color: colors.transparent.white70,
    fontWeight: '600',
  },
});
