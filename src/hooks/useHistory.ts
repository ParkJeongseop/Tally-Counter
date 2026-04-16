import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HistoryRecord} from '../types/history';
import {HISTORY_STORAGE_KEY} from '../constants/storage';

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (saved !== null) {
          setHistory(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  const saveHistory = async (records: HistoryRecord[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const addRecord = async (count: number, label?: string) => {
    const record: HistoryRecord = {
      id: generateId(),
      count,
      timestamp: Date.now(),
      label: label?.trim() || undefined,
    };
    const updated = [record, ...history];
    setHistory(updated);
    await saveHistory(updated);
  };

  const deleteRecord = async (id: string) => {
    const updated = history.filter(r => r.id !== id);
    setHistory(updated);
    await saveHistory(updated);
  };

  const updateLabel = async (id: string, label: string) => {
    const updated = history.map(r =>
      r.id === id ? {...r, label: label.trim() || undefined} : r,
    );
    setHistory(updated);
    await saveHistory(updated);
  };

  const clearAllHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  return {history, isLoading, addRecord, deleteRecord, updateLabel, clearAllHistory};
};
