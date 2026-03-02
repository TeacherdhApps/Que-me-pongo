
import { useState, useCallback } from 'react';
import { loadWardrobe, addClothingItem, updateClothingItem, deleteClothingItem, loadWeeklyPlan, saveWeeklyPlan } from '../lib/wardrobeStorage';
import type { ClothingItem, Category, WeeklyPlan, DailyOutfit } from '../types';

export function useWardrobe() {
    const [wardrobe, setWardrobe] = useState<ClothingItem[]>(() => loadWardrobe());

    const add = useCallback((item: Omit<ClothingItem, 'id'>) => {
        const newItem = addClothingItem(item);
        setWardrobe(prev => [...prev, newItem]);
        return newItem;
    }, []);

    const update = useCallback((id: string, updates: Partial<ClothingItem>) => {
        updateClothingItem(id, updates);
        setWardrobe(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    }, []);

    const remove = useCallback((id: string) => {
        deleteClothingItem(id);
        setWardrobe(prev => prev.filter(item => item.id !== id));
    }, []);

    const filterByCategory = useCallback((category: Category) => {
        return wardrobe.filter(item => item.category === category);
    }, [wardrobe]);

    return { wardrobe, add, update, remove, filterByCategory };
}


export function useWeeklyPlan() {
    const [plan, setPlan] = useState<WeeklyPlan>(() => loadWeeklyPlan());

    const updateDay = useCallback((day: string, outfit: DailyOutfit) => {
        setPlan(prev => {
            const next = { ...prev, [day]: outfit };
            saveWeeklyPlan(next);
            return next;
        });
    }, []);

    return { plan, updateDay };
}
