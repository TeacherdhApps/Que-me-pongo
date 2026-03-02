
import type { ClothingItem, WeeklyPlan, UserProfile } from '../types';

const WARDROBE_KEY = 'que-me-pongo:wardrobe';
const WEEKLY_PLAN_KEY = 'que-me-pongo:weekly-plan';
const USER_PROFILE_KEY = 'que-me-pongo:user-profile';

// --- Wardrobe CRUD ---

export function loadWardrobe(): ClothingItem[] {
    try {
        const raw = localStorage.getItem(WARDROBE_KEY);
        // Fallback to cc_items if que-me-pongo:wardrobe is empty (migration)
        if (!raw) {
            const legacy = localStorage.getItem('cc_items');
            if (legacy) return JSON.parse(legacy);
        }
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveWardrobe(items: ClothingItem[]): void {
    localStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
}

export function addClothingItem(item: Omit<ClothingItem, 'id'>): ClothingItem {
    const newItem: ClothingItem = {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    const wardrobe = loadWardrobe();
    saveWardrobe([...wardrobe, newItem]);
    return newItem;
}

export function updateClothingItem(id: string, updates: Partial<ClothingItem>): void {
    const wardrobe = loadWardrobe();
    const updated = wardrobe.map(item => item.id === id ? { ...item, ...updates } : item);
    saveWardrobe(updated);
}

export function deleteClothingItem(id: string): void {
    const wardrobe = loadWardrobe();
    saveWardrobe(wardrobe.filter(item => item.id !== id));
}

// --- Weekly Plan ---

export function loadWeeklyPlan(): WeeklyPlan {
    try {
        const raw = localStorage.getItem(WEEKLY_PLAN_KEY);
        if (raw) return JSON.parse(raw);

        // Fallback to cc_plan migration
        const legacy = localStorage.getItem('cc_plan');
        if (legacy) {
            const legacyPlan = JSON.parse(legacy);
            const wardrobe = loadWardrobe();
            const migratedPlan: WeeklyPlan = {};

            Object.entries(legacyPlan).forEach(([day, ids]) => {
                if (Array.isArray(ids)) {
                    migratedPlan[day] = {
                        day,
                        items: ids
                            .map(id => wardrobe.find(item => item.id == id || item.id === String(id)))
                            .filter(Boolean) as ClothingItem[]
                    };
                }
            });
            return migratedPlan;
        }
        return {};
    } catch {
        return {};
    }
}

export function saveWeeklyPlan(plan: WeeklyPlan): void {
    localStorage.setItem(WEEKLY_PLAN_KEY, JSON.stringify(plan));
}

// --- User Profile ---

export function loadUserProfile(): UserProfile {
    try {
        const raw = localStorage.getItem(USER_PROFILE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

// --- Export / Import ---

interface AppDataExport {
    version: 1;
    exportedAt: string;
    wardrobe: ClothingItem[];
    weeklyPlan: WeeklyPlan;
    userProfile: UserProfile;
}

export function exportAllData(): string {
    const data: AppDataExport = {
        version: 1,
        exportedAt: new Date().toISOString(),
        wardrobe: loadWardrobe(),
        weeklyPlan: loadWeeklyPlan(),
        userProfile: loadUserProfile(),
    };
    return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): void {
    const data: AppDataExport = JSON.parse(jsonString);
    if (data.wardrobe) saveWardrobe(data.wardrobe);
    if (data.weeklyPlan) saveWeeklyPlan(data.weeklyPlan);
    if (data.userProfile) saveUserProfile(data.userProfile);
}
