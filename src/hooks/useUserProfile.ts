
import { useState, useCallback } from 'react';
import { loadUserProfile, saveUserProfile } from '../lib/wardrobeStorage';
import type { UserProfile } from '../types';

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());

    const update = useCallback((updates: Partial<UserProfile>) => {
        setProfile(prev => {
            const next = { ...prev, ...updates };
            saveUserProfile(next);
            return next;
        });
    }, []);

    return { profile, update };
}
