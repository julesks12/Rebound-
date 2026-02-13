import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import type { HistoryStackParamList, RootTabParamList } from '../navigation/types';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { useEntries } from '../state/EntriesContext';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import type { DailyEntry } from '../types/DailyEntry';

type Props = NativeStackScreenProps<HistoryStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const listRef = useRef<SectionList<DailyEntry>>(null);
  const { entries, isLoading, refresh } = useEntries();

  useFocusEffect(
    React.useCallback(() => {
      void refresh();
    }, [refresh])
  );

  useEffect(() => {
    navigation.setOptions({
      title: 'History',
      headerRight: () => (
        <Pressable
          onPress={() => {
            if (!entries.length) return;
            listRef.current?.scrollToLocation({ sectionIndex: 0, itemIndex: 0, animated: true });
          }}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
        >
          <Text style={styles.headerBtnText}>Latest</Text>
        </Pressable>
      ),
    });
  }, [entries.length, navigation]);

  const sections = useMemo(() => {
    const byMonth = new Map<string, DailyEntry[]>();
    for (const e of entries) {
      const [y, m] = e.date.split('-').map((x) => Number(x));
      const monthKey = `${y}-${String(m).padStart(2, '0')}`;
      const list = byMonth.get(monthKey) ?? [];
      list.push(e);
      byMonth.set(monthKey, list);
    }

    const sortedMonthKeys = [...byMonth.keys()].sort((a, b) => (a > b ? -1 : 1));
    return sortedMonthKeys.map((monthKey) => {
      const [y, m] = monthKey.split('-').map((x) => Number(x));
      const title = new Date(y, m - 1, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
      const data = (byMonth.get(monthKey) ?? []).slice().sort((a, b) => (a.date > b.date ? -1 : 1));
      return { title, data };
    });
  }, [entries]);

  const goToCheckIn = () =>
    (navigation.getParent() as any)?.navigate('CheckInTab' satisfies keyof RootTabParamList, {
      screen: 'CheckIn',
    });

  return (
    <View style={styles.safe}>
      {isLoading && !entries.length ? (
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      ) : null}

      {!entries.length ? (
        <View style={styles.emptyWrap}>
          <Card>
            <Text style={styles.title}>No check-ins yet</Text>
            <Text style={styles.body}>Your past entries will show up here. Start with a quick check-in today.</Text>
            <View style={{ marginTop: Spacing.md }}>
              <PrimaryButton label="Start your first check-in" onPress={goToCheckIn} />
            </View>
          </Card>
        </View>
      ) : (
        <SectionList
          ref={listRef}
          sections={sections}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('EntryDetail', { date: item.date })}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.rowTitle}>{item.date}</Text>
                <Text style={styles.rowSub}>
                  Mood {item.mood} · Energy {item.energy}
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  headerBtnText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
  listContent: { padding: Spacing.md, gap: 10 },
  sectionHeader: {
    paddingTop: Spacing.md,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  sectionHeaderText: { fontSize: 13, fontWeight: '700', color: Colors.mutedText },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  body: { fontSize: 14, color: Colors.mutedText },
  row: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { gap: 4 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: Colors.text },
  rowSub: { fontSize: 12, color: Colors.mutedText, marginTop: 2 },
  chev: { fontSize: 22, color: Colors.mutedText },
  emptyWrap: { flex: 1, padding: Spacing.md },
  loadingWrap: { padding: Spacing.md },
  loadingText: { color: Colors.mutedText },
});

