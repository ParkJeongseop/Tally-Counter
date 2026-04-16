import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GOAL_STORAGE_KEY} from '../constants/storage';

export const useGoal = () => {
  const [goal, setGoalState] = useState<number | null>(null);

  useEffect(() => {
    const loadGoal = async () => {
      try {
        const saved = await AsyncStorage.getItem(GOAL_STORAGE_KEY);
        if (saved !== null) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed > 0) {
            setGoalState(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading goal:', error);
      }
    };
    loadGoal();
  }, []);

  const setGoal = async (value: number | null) => {
    setGoalState(value);
    try {
      if (value !== null && value > 0) {
        await AsyncStorage.setItem(GOAL_STORAGE_KEY, value.toString());
      } else {
        await AsyncStorage.removeItem(GOAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return {goal, setGoal};
};
