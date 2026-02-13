import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import type { HistoryStackParamList, RootTabParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { useEntries } from '../state/EntriesContext';
import { useSettings } from '../state/SettingsContext';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<HistoryStackParamList, 'EntryDetail'>;

export function EntryDetailScreen({ navigation, route }: Props) {
  const { date } = route.params;
  const { getByDate } = useEntries();
  const { settings } = useSettings();

  const entry = getByDate(date);

  const goToEdit = () =>
    (navigation.getParent() as any)?.navigate('CheckInTab' satisfies keyof RootTabParamList, {
      screen: 'CheckIn',
      params: { date },
    });

  useEffect(() => {
    navigation.setOptions({
      title: date,
      headerRight: () => (
        <Pressable
          onPress={goToEdit}
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
        >
          <Text style={styles.headerBtnText}>Edit</Text>
        </Pressable>
      ),
    });
  }, [date, goToEdit, navigation]);

  return (
    <Screen scroll>
      {!entry ? (
        <Card>
          <Text style={styles.title}>Entry not found</Text>
          <Text style={styles.body}>This check-in may have been deleted.</Text>
          <View style={{ marginTop: Spacing.md }}>
            <PrimaryButton label="Back to history" onPress={() => navigation.goBack()} />
          </View>
        </Card>
      ) : (
        <>
          <Card>
            <Text style={styles.title}>Scores</Text>
            <Text style={styles.body}>
              Mood {entry.mood} · Energy {entry.energy} · Sleep {entry.sleepQuality} · Stress {entry.stress}
            </Text>
          </Card>

          <Card>
            <Text style={styles.title}>Symptoms</Text>
            <Text style={styles.body}>
              {entry.symptoms?.length ? entry.symptoms.join(', ') : 'None selected'}
              {entry.symptomsOtherText?.trim() ? ` · Other: ${entry.symptomsOtherText.trim()}` : ''}
            </Text>
          </Card>

          <Card>
            <Text style={styles.title}>Habits</Text>
            <Text style={styles.body}>
              Hydration: {entry.hydration} {settings.hydrationUnit} · Medication:{' '}
              {entry.medicationTaken ? 'Yes' : 'No'} · Movement: {entry.movement ? 'Yes' : 'No'}
            </Text>
          </Card>

          <Card>
            <Text style={styles.title}>Notes</Text>
            <Text style={styles.body}>{entry.notes?.trim() ? entry.notes.trim() : '—'}</Text>
          </Card>

          <Card>
            <Text style={styles.title}>Saved</Text>
            <Text style={styles.body}>Created {new Date(entry.createdAt).toLocaleString()}</Text>
            <Text style={[styles.body, { marginTop: 4 }]}>
              Updated {new Date(entry.updatedAt).toLocaleString()}
            </Text>
            <View style={{ marginTop: Spacing.md }}>
              <PrimaryButton label="Edit this check-in" onPress={goToEdit} />
            </View>
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  headerBtnText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
  title: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  body: { fontSize: 14, color: Colors.mutedText },
});

