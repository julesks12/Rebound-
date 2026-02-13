import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import type { CheckInStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<CheckInStackParamList, 'CheckIn'>;

export function CheckInScreen({ route }: Props) {
  const date = route.params?.date;

  return (
    <Screen scroll>
      <Card>
        <Text style={styles.title}>{date ? `Edit Check-In (${date})` : "Today's Check-In"}</Text>
        <Text style={styles.body}>Check-in form coming next (sliders, symptoms, notes).</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  body: { fontSize: 14, color: Colors.mutedText },
});

