import type { HydrationUnit } from './DailyEntry';

export type Settings = {
  hydrationUnit: HydrationUnit;
};

export const DEFAULT_SETTINGS: Settings = {
  hydrationUnit: 'cups',
};

