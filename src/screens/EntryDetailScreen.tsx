import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import type { HistoryStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<HistoryStackParamList, 'EntryDetail'>;

export function EntryDetailScreen({ route }: Props) {
  const { date } = route.params;

  return (
    <Screen scroll>
      <Card>
        <Text style={styles.title}>{date}</Text>
        <Text style={styles.body}>Entry details + edit action will be implemented next.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  body: { fontSize: 14, color: Colors.mutedText },
});

