import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Settings } from '../types/Settings';
import { DEFAULT_SETTINGS } from '../types/Settings';
import { getSettings, updateSettings } from '../storage/settings';

type SettingsContextValue = {
  settings: Settings;
  isLoading: boolean;
  lastError: string | null;
  refresh: () => Promise<void>;
  update: (patch: Partial<Settings>) => Promise<Settings>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setLastError(null);
    try {
      const next = await getSettings();
      setSettingsState(next);
    } catch (e) {
      setLastError(e instanceof Error ? e.message : 'Failed to load settings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const update = useCallback(async (patch: Partial<Settings>) => {
    setLastError(null);
    const next = await updateSettings(patch);
    setSettingsState(next);
    return next;
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, isLoading, lastError, refresh, update }),
    [settings, isLoading, lastError, refresh, update]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

