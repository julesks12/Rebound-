import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DailyEntry, DailyEntryDraft } from '../types/DailyEntry';
import { compareDateKeysDesc } from '../utils/date';

const ENTRIES_KEY = '@rebound/entries/v1';

function normalizeEntry(entry: DailyEntry): DailyEntry {
  return {
    ...entry,
    symptoms: Array.isArray(entry.symptoms) ? entry.symptoms : [],
    notes: entry.notes ?? '',
    symptomsOtherText: entry.symptomsOtherText ?? '',
  };
}

async function readAll(): Promise<DailyEntry[]> {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  return parsed.map((e) => normalizeEntry(e as DailyEntry));
}

async function writeAll(entries: DailyEntry[]): Promise<void> {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function listEntries(): Promise<DailyEntry[]> {
  const entries = await readAll();
  return entries.sort((a, b) => compareDateKeysDesc(a.date, b.date));
}

export async function getEntryByDate(date: string): Promise<DailyEntry | null> {
  const entries = await readAll();
  return entries.find((e) => e.date === date) ?? null;
}

export async function upsertEntry(draft: DailyEntryDraft): Promise<DailyEntry> {
  const now = new Date().toISOString();
  const entries = await readAll();
  const existingIdx = entries.findIndex((e) => e.date === draft.date);

  if (existingIdx >= 0) {
    const existing = entries[existingIdx];
    const updated: DailyEntry = normalizeEntry({
      ...existing,
      ...draft,
      createdAt: existing.createdAt ?? now,
      updatedAt: now,
    });
    const next = [...entries];
    next[existingIdx] = updated;
    await writeAll(next);
    return updated;
  }

  const created: DailyEntry = normalizeEntry({
    ...draft,
    createdAt: now,
    updatedAt: now,
  });
  const next = [...entries, created];
  await writeAll(next);
  return created;
}

export async function deleteAllEntries(): Promise<void> {
  await AsyncStorage.removeItem(ENTRIES_KEY);
}

