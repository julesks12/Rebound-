import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import type { HistoryStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<HistoryStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  return (
    <Screen scroll>
      <Card>
        <Text style={styles.title}>History</Text>
        <Text style={styles.body}>Your entries will be grouped here (tap to view/edit).</Text>
      </Card>

      <Pressable
        onPress={() => navigation.navigate('EntryDetail', { date: '2026-02-13' })}
        style={styles.fakeRow}
      >
        <View>
          <Text style={styles.rowTitle}>Example entry</Text>
          <Text style={styles.rowSub}>2026-02-13</Text>
        </View>
        <Text style={styles.chev}>›</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  body: { fontSize: 14, color: Colors.mutedText },
  fakeRow: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: { fontSize: 16, fontWeight: '600', color: Colors.text },
  rowSub: { fontSize: 12, color: Colors.mutedText, marginTop: 2 },
  chev: { fontSize: 22, color: Colors.mutedText },
});

