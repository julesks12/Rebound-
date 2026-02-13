import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import type { DashboardStackParamList, RootTabParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { WeeklyLineChart } from '../components/WeeklyLineChart';
import { useEntries } from '../state/EntriesContext';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { lastNDaysKeys, todayKey } from '../utils/date';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const { entries, refresh } = useEntries();

  useFocusEffect(
    React.useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const byDate = useMemo(() => new Map(entries.map((e) => [e.date, e] as const)), [entries]);
  const today = todayKey();
  const todayEntry = byDate.get(today);

  const last7Keys = useMemo(() => lastNDaysKeys(7), []);
  const last7Entries = useMemo(
    () => last7Keys.map((k) => byDate.get(k) ?? null),
    [byDate, last7Keys]
  );

  const moodValues = last7Entries.map((e) => (e ? e.mood : null));
  const energyValues = last7Entries.map((e) => (e ? e.energy : null));
  const labels = useMemo(
    () =>
      last7Keys.map((k) => {
        const [y, m, d] = k.split('-').map((x) => Number(x));
        return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short' });
      }),
    [last7Keys]
  );

  const weekStats = useMemo(() => {
    const present = last7Entries.filter(Boolean) as NonNullable<(typeof last7Entries)[number]>[];
    const count = present.length;
    const avg = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length)).toFixed(1);
    return {
      count,
      moodAvg: count ? avg(present.map((e) => e.mood)) : '—',
      energyAvg: count ? avg(present.map((e) => e.energy)) : '—',
      sleepAvg: count ? avg(present.map((e) => e.sleepQuality)) : '—',
      stressAvg: count ? avg(present.map((e) => e.stress)) : '—',
    };
  }, [last7Entries]);

  const insight = useMemo(() => {
    const keys14 = lastNDaysKeys(14);
    const prevKeys = keys14.slice(0, 7);
    const curKeys = keys14.slice(7);
    const prev = prevKeys
      .map((k) => byDate.get(k))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));
    const cur = curKeys
      .map((k) => byDate.get(k))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));
    if (prev.length < 3 || cur.length < 3) return 'Check in a few more days to unlock weekly trends.';

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const prevEnergy = avg(prev.map((e) => e.energy));
    const curEnergy = avg(cur.map((e) => e.energy));
    const diff = curEnergy - prevEnergy;
    if (diff > 0.6) return 'Your energy is trending up vs last week.';
    if (diff < -0.6) return 'Your energy is trending down vs last week.';
    return 'Your energy is steady vs last week.';
  }, [byDate]);

  const primaryLabel = todayEntry ? "Edit Today’s Check-In" : 'Daily Check-In';

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Rebound</Text>
        <Text style={styles.subtitle}>Daily recovery, one check-in at a time.</Text>
      </View>

      <PrimaryButton
        label={primaryLabel}
        onPress={() =>
          (navigation.getParent() as any)?.navigate('CheckInTab' satisfies keyof RootTabParamList, {
            screen: 'CheckIn',
          })
        }
      />

      <Card>
        <Text style={styles.cardTitle}>Today</Text>
        <Text style={styles.cardBody}>
          {todayEntry
            ? `Completed · Mood ${todayEntry.mood} · Energy ${todayEntry.energy}`
            : 'Not completed yet · A quick check-in takes under a minute.'}
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Last 7 days</Text>
        {!entries.length ? (
          <Text style={styles.cardBody}>No entries yet. Start with today’s check-in to build momentum.</Text>
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Days</Text>
                <Text style={styles.statValue}>{weekStats.count}/7</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Mood</Text>
                <Text style={styles.statValue}>{weekStats.moodAvg}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Energy</Text>
                <Text style={styles.statValue}>{weekStats.energyAvg}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Sleep</Text>
                <Text style={styles.statValue}>{weekStats.sleepAvg}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Stress</Text>
                <Text style={styles.statValue}>{weekStats.stressAvg}</Text>
              </View>
            </View>

            <View style={styles.divider} />
            <WeeklyLineChart labels={labels} moodValues={moodValues} energyValues={energyValues} />
            <Text style={[styles.cardBody, { marginTop: 6 }]}>{insight}</Text>
          </>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mutedText,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    color: Colors.mutedText,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  stat: {
    minWidth: 56,
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.mutedText,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
});

