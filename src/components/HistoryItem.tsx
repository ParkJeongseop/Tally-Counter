import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {HistoryRecord} from '../types/history';
import {colors} from '../styles/colors';
import {t} from '../i18n';

interface HistoryItemProps {
  record: HistoryRecord;
  onDelete: (id: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day}  ${hours}:${minutes}`;
};

export const HistoryItem: React.FC<HistoryItemProps> = ({
  record,
  onDelete,
  onUpdateLabel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(record.label || '');

  const handleDelete = () => {
    Alert.alert(t('confirmDelete'), undefined, [
      {text: t('cancel'), style: 'cancel'},
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => onDelete(record.id),
      },
    ]);
  };

  const handleLabelSubmit = () => {
    onUpdateLabel(record.id, labelText);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.count}>{record.count.toLocaleString()}</Text>
        {isEditing ? (
          <TextInput
            style={styles.labelInput}
            value={labelText}
            onChangeText={setLabelText}
            placeholder={t('labelPlaceholder')}
            placeholderTextColor="rgba(0,0,0,0.3)"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleLabelSubmit}
            onBlur={handleLabelSubmit}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} activeOpacity={0.6}>
            <Text style={record.label ? styles.label : styles.labelPlaceholder}>
              {record.label || t('labelPlaceholder')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.date}>{formatDate(record.timestamp)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.transparent.white95,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  count: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
  },
  label: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  labelPlaceholder: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.25)',
    fontWeight: '500',
    marginTop: 4,
  },
  labelInput: {
    fontSize: 13,
    color: colors.dark,
    fontWeight: '600',
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    fontWeight: '500',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '700',
  },
});
