import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { DailyEntry } from '../types/DailyEntry';

function csvEscape(value: string) {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function entriesToCSV(entries: DailyEntry[]): string {
  const header = [
    'date',
    'mood',
    'energy',
    'sleepQuality',
    'stress',
    'symptoms',
    'symptomsOtherText',
    'hydration',
    'medicationTaken',
    'movement',
    'notes',
    'createdAt',
    'updatedAt',
  ];

  const rows = entries.map((e) => [
    e.date,
    String(e.mood),
    String(e.energy),
    String(e.sleepQuality),
    String(e.stress),
    csvEscape((e.symptoms ?? []).join('; ')),
    csvEscape(e.symptomsOtherText ?? ''),
    String(e.hydration ?? 0),
    String(!!e.medicationTaken),
    String(!!e.movement),
    csvEscape(e.notes ?? ''),
    e.createdAt,
    e.updatedAt,
  ]);

  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export async function shareStringAsFile({
  filename,
  contents,
  mimeType,
  uti,
}: {
  filename: string;
  contents: string;
  mimeType: string;
  uti?: string;
}) {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device.');
  }

  const file = new File(Paths.cache, filename);
  file.create({ intermediates: true, overwrite: true });
  file.write(contents, { encoding: 'utf8' });
  await Sharing.shareAsync(file.uri, { mimeType, UTI: uti, dialogTitle: 'Export Rebound data' });
}

