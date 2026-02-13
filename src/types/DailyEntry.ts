export type HydrationUnit = 'cups' | 'oz';

export type DailyEntry = {
  date: string; // YYYY-MM-DD
  mood: number; // 1-10
  energy: number; // 1-10
  sleepQuality: number; // 1-10
  stress: number; // 1-10
  symptoms: string[];
  symptomsOtherText?: string;
  hydration: number; // unit controlled by settings
  medicationTaken: boolean;
  movement: boolean;
  notes: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

export type DailyEntryDraft = Omit<DailyEntry, 'createdAt' | 'updatedAt'>;

