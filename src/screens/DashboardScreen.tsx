import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import type { DashboardStackParamList, RootTabParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Rebound</Text>
        <Text style={styles.subtitle}>Daily recovery, one check-in at a time.</Text>
      </View>

      <PrimaryButton
        label="Daily Check-In"
        onPress={() =>
          (navigation.getParent() as any)?.navigate('CheckInTab' satisfies keyof RootTabParamList, {
            screen: 'CheckIn',
          })
        }
      />

      <Card>
        <Text style={styles.cardTitle}>Today</Text>
        <Text style={styles.cardBody}>We’ll show your completion status here.</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Last 7 days</Text>
        <Text style={styles.cardBody}>Your weekly summary and trends will appear here.</Text>
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
});

