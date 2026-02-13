import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { DailyEntry, DailyEntryDraft } from '../types/DailyEntry';
import { deleteAllEntries, listEntries, upsertEntry } from '../storage/entries';

type EntriesContextValue = {
  entries: DailyEntry[];
  isLoading: boolean;
  lastError: string | null;
  refresh: () => Promise<void>;
  upsert: (draft: DailyEntryDraft) => Promise<DailyEntry>;
  deleteAll: () => Promise<void>;
  getByDate: (date: string) => DailyEntry | undefined;
};

const EntriesContext = createContext<EntriesContextValue | null>(null);

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setLastError(null);
    try {
      const next = await listEntries();
      setEntries(next);
    } catch (e) {
      setLastError(e instanceof Error ? e.message : 'Failed to load entries.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upsert = useCallback(async (draft: DailyEntryDraft) => {
    setLastError(null);
    const saved = await upsertEntry(draft);
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.date === saved.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    return saved;
  }, []);

  const deleteAll = useCallback(async () => {
    setLastError(null);
    await deleteAllEntries();
    setEntries([]);
  }, []);

  const getByDate = useCallback(
    (date: string) => entries.find((e) => e.date === date),
    [entries]
  );

  const value = useMemo<EntriesContextValue>(
    () => ({ entries, isLoading, lastError, refresh, upsert, deleteAll, getByDate }),
    [entries, isLoading, lastError, refresh, upsert, deleteAll, getByDate]
  );

  return <EntriesContext.Provider value={value}>{children}</EntriesContext.Provider>;
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntries must be used within EntriesProvider');
  return ctx;
}

