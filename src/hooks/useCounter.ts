import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../constants/storage';

export const useCounter = () => {
  const [count, setCount] = useState(0);

  // Load saved count on app start
  useEffect(() => {
    const loadCount = async () => {
      try {
        const savedCount = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCount !== null) {
          setCount(parseInt(savedCount, 10));
          console.log('Loaded saved count:', savedCount);
        }
      } catch (error) {
        console.error('Error loading count:', error);
      }
    };
    loadCount();
  }, []);

  // Save count whenever it changes
  useEffect(() => {
    const saveCount = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, count.toString());
        console.log('Saved count:', count);
      } catch (error) {
        console.error('Error saving count:', error);
      }
    };
    saveCount();
  }, [count]);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  return {
    count,
    setCount,
    increment,
    decrement,
    reset,
  };
};