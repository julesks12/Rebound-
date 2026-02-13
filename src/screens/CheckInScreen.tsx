import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CheckInStackParamList } from '../navigation/types';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { InlineBanner } from '../components/InlineBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { RatingSlider } from '../components/RatingSlider';
import { useEntries } from '../state/EntriesContext';
import { useSettings } from '../state/SettingsContext';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import type { DailyEntryDraft } from '../types/DailyEntry';
import { todayKey } from '../utils/date';

type Props = NativeStackScreenProps<CheckInStackParamList, 'CheckIn'>;

const COMMON_SYMPTOMS = [
  'Headache',
  'Nausea',
  'Fatigue',
  'Brain fog',
  'Anxiety',
  'Irritability',
  'Muscle aches',
  'Stomach upset',
  'Sore throat',
];

export function CheckInScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { upsert, getByDate } = useEntries();
  const { settings } = useSettings();

  const dateKey = route.params?.date ?? todayKey();
  const isToday = dateKey === todayKey();
  const existing = getByDate(dateKey);

  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stress, setStress] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomsOtherText, setSymptomsOtherText] = useState('');
  const [hydrationText, setHydrationText] = useState('');
  const [medicationTaken, setMedicationTaken] = useState(false);
  const [movement, setMovement] = useState(false);
  const [notes, setNotes] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [banner, setBanner] = useState<{ tone: 'success' | 'error' | 'info'; msg: string } | null>(
    null
  );

  const initialSnapshotRef = useRef<string>('');
  const hydratedTokenRef = useRef<string>('');

  useEffect(() => {
    const title = existing
      ? isToday
        ? "Edit Today's Check-In"
        : `Edit Check-In`
      : isToday
        ? 'Daily Check-In'
        : 'New Check-In';
    navigation.setOptions({ title });
  }, [existing, isToday, navigation]);

  const hydrateToken = `${dateKey}:${existing?.updatedAt ?? 'none'}`;

  const snapshot = useMemo(
    () =>
      JSON.stringify({
        dateKey,
        mood,
        energy,
        sleepQuality,
        stress,
        symptoms: [...symptoms].sort(),
        symptomsOtherText,
        hydrationText,
        medicationTaken,
        movement,
        notes,
      }),
    [
      dateKey,
      mood,
      energy,
      sleepQuality,
      stress,
      symptoms,
      symptomsOtherText,
      hydrationText,
      medicationTaken,
      movement,
      notes,
    ]
  );

  const isDirty = initialSnapshotRef.current !== '' && snapshot !== initialSnapshotRef.current;

  useEffect(() => {
    // Hydrate from storage when (a) date changes or (b) the stored entry changes,
    // but never overwrite in-progress edits.
    if (isDirty) return;
    if (hydratedTokenRef.current === hydrateToken) return;
    hydratedTokenRef.current = hydrateToken;
    initialSnapshotRef.current = '';

    setMood(existing?.mood ?? 5);
    setEnergy(existing?.energy ?? 5);
    setSleepQuality(existing?.sleepQuality ?? 5);
    setStress(existing?.stress ?? 5);
    setSymptoms(existing?.symptoms ?? []);
    setSymptomsOtherText(existing?.symptomsOtherText ?? '');
    setHydrationText(existing?.hydration ? String(existing.hydration) : '');
    setMedicationTaken(existing?.medicationTaken ?? false);
    setMovement(existing?.movement ?? false);
    setNotes(existing?.notes ?? '');
    setBanner(null);
  }, [existing, hydrateToken, isDirty]);

  useEffect(() => {
    // Capture initial snapshot after state settles (and after re-init).
    if (initialSnapshotRef.current === '') {
      initialSnapshotRef.current = snapshot;
    }
  }, [snapshot]);

  useEffect(() => {
    const sub = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty) return;
      e.preventDefault();
      Alert.alert('Discard changes?', 'You have unsaved updates. Do you want to discard them?', [
        { text: 'Keep editing', style: 'cancel', onPress: () => {} },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]);
    });
    return sub;
  }, [isDirty, navigation]);

  function toggleSymptom(label: string) {
    setSymptoms((prev) => (prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]));
  }

  async function onSave() {
    setBanner(null);

    if (!(mood >= 1 && mood <= 10) || !(energy >= 1 && energy <= 10)) {
      setBanner({ tone: 'error', msg: 'Please set mood and energy (1–10).' });
      return;
    }

    const parsedHydration = Number(String(hydrationText).trim().replace(',', '.'));
    const hydration = Number.isFinite(parsedHydration) ? parsedHydration : 0;

    const draft: DailyEntryDraft = {
      date: dateKey,
      mood,
      energy,
      sleepQuality,
      stress,
      symptoms,
      symptomsOtherText: symptomsOtherText.trim(),
      hydration,
      medicationTaken,
      movement,
      notes: notes.trim(),
    };

    try {
      setIsSaving(true);
      await upsert(draft);
      setBanner({ tone: 'success', msg: 'Saved.' });
      initialSnapshotRef.current = snapshot;
    } catch (e) {
      setBanner({
        tone: 'error',
        msg: e instanceof Error ? e.message : 'Could not save your check-in. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 92 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 120 + insets.bottom, paddingTop: Spacing.md },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {banner ? <InlineBanner tone={banner.tone} message={banner.msg} /> : null}

          <Card>
            <Text style={styles.sectionTitle}>{isToday ? 'Today' : dateKey}</Text>
            <Text style={styles.sectionSub}>
              {existing ? 'You can edit and resave any time.' : 'Fill what you can — mood and energy are required.'}
            </Text>

            <View style={styles.divider} />

            <RatingSlider label="Mood" value={mood} onChange={setMood} />
            <RatingSlider label="Energy" value={energy} onChange={setEnergy} />
            <RatingSlider label="Sleep quality" value={sleepQuality} onChange={setSleepQuality} />
            <RatingSlider label="Stress" value={stress} onChange={setStress} />
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>Symptoms</Text>
            <Text style={styles.sectionSub}>Tap to select any that apply.</Text>
            <View style={styles.chips}>
              {COMMON_SYMPTOMS.map((s) => (
                <Chip key={s} label={s} selected={symptoms.includes(s)} onPress={() => toggleSymptom(s)} />
              ))}
            </View>
            <Text style={[styles.label, { marginTop: Spacing.sm }]}>Other</Text>
            <TextInput
              value={symptomsOtherText}
              onChangeText={setSymptomsOtherText}
              placeholder="Optional"
              placeholderTextColor={Colors.mutedText}
              style={styles.input}
            />
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>Hydration</Text>
            <Text style={styles.sectionSub}>
              Enter how much you drank today ({settings.hydrationUnit}).
            </Text>
            <TextInput
              value={hydrationText}
              onChangeText={setHydrationText}
              placeholder={settings.hydrationUnit === 'cups' ? 'e.g. 8' : 'e.g. 64'}
              placeholderTextColor={Colors.mutedText}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              style={styles.input}
            />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Medication taken</Text>
              <Switch value={medicationTaken} onValueChange={setMedicationTaken} />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Movement</Text>
              <Switch value={movement} onValueChange={setMovement} />
            </View>
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Optional"
              placeholderTextColor={Colors.mutedText}
              style={[styles.input, styles.notes]}
              multiline
              textAlignVertical="top"
            />
          </Card>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <PrimaryButton label={existing ? 'Save changes' : 'Save check-in'} onPress={onSave} loading={isSaving} />
          {isDirty ? <Text style={styles.dirtyHint}>Unsaved changes</Text> : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.mutedText,
    marginTop: 4,
    marginBottom: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 15,
  },
  notes: {
    minHeight: 120,
  },
  toggleRow: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: 'rgba(247,248,250,0.96)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: 8,
  },
  dirtyHint: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.mutedText,
  },
});

