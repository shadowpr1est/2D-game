import { useEffect, useState } from 'react';
import { Food } from '../types/game';
import { firebaseService } from '../services/firebase';

export const useRealtimeFood = () => {
  const [food, setFood] = useState<Record<string, Food>>({});

  useEffect(() => {
    const handleFoodAdded = (f: Food) => {
      setFood(prev => ({ ...prev, [f.id]: f }));
    };
    const handleFoodRemoved = (foodId: string) => {
      setFood(prev => {
        const copy = { ...prev };
        delete copy[foodId];
        return copy;
      });
    };
    firebaseService.onFoodAdded(handleFoodAdded);
    firebaseService.onFoodRemoved(handleFoodRemoved);
    // no onFoodChanged, food не меняется
    return () => {};
  }, []);

  return food;
}; 