import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const USER_PREFERENCES_KEY = '@gostreamer_user_prefs';

export interface UserPreferences {
  userName: string;
  userId: string;
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      } else {
        const newPrefs: UserPreferences = {
          userName: `User_${Math.random().toString(36).substr(2, 9)}`,
          userId: `user_${Math.random().toString(36).substr(2, 9)}`,
        };
        await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(newPrefs));
        setPreferences(newPrefs);
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserName = async (userName: string) => {
    try {
      const updated = { ...preferences, userName } as UserPreferences;
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated));
      setPreferences(updated);
    } catch (error) {
      console.error('Failed to update user preferences:', error);
    }
  };

  return { preferences, loading, updateUserName };
}
