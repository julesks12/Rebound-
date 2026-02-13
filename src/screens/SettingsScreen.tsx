import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import Constants from 'expo-constants';

import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { InlineBanner } from '../components/InlineBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useEntries } from '../state/EntriesContext';
import { useSettings } from '../state/SettingsContext';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { todayKey } from '../utils/date';
import { entriesToCSV, shareStringAsFile } from '../utils/export';

export function SettingsScreen() {
  const { entries, deleteAll } = useEntries();
  const { settings, update } = useSettings();
  const [banner, setBanner] = useState<{ tone: 'success' | 'error' | 'info'; msg: string } | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);

  const appVersion =
    Constants.expoConfig?.version ??
    (Constants as any).manifest2?.runtimeVersion ??
    (Constants as any).manifest?.version ??
    '1.0.0';

  const exportBase = useMemo(() => `rebound-export-${todayKey()}`, []);

  async function exportJSON() {
    setBanner(null);
    try {
      setIsExporting(true);
      await shareStringAsFile({
        filename: `${exportBase}.json`,
        contents: JSON.stringify(entries, null, 2),
        mimeType: 'application/json',
        uti: 'public.json',
      });
      setBanner({ tone: 'success', msg: 'Export started.' });
    } catch (e) {
      setBanner({
        tone: 'error',
        msg: e instanceof Error ? e.message : 'Export failed. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  }

  async function exportCSV() {
    setBanner(null);
    try {
      setIsExporting(true);
      await shareStringAsFile({
        filename: `${exportBase}.csv`,
        contents: entriesToCSV(entries),
        mimeType: 'text/csv',
        uti: 'public.comma-separated-values-text',
      });
      setBanner({ tone: 'success', msg: 'Export started.' });
    } catch (e) {
      setBanner({
        tone: 'error',
        msg: e instanceof Error ? e.message : 'Export failed. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  }

  function confirmClearAll() {
    Alert.alert(
      'Clear all data?',
      'This deletes all check-ins from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear all data',
          style: 'destructive',
          onPress: async () => {
            setBanner(null);
            try {
              await deleteAll();
              setBanner({ tone: 'success', msg: 'All data cleared.' });
            } catch (e) {
              setBanner({
                tone: 'error',
                msg: e instanceof Error ? e.message : 'Could not clear data. Please try again.',
              });
            }
          },
        },
      ]
    );
  }

  return (
    <Screen scroll>
      {banner ? <InlineBanner tone={banner.tone} message={banner.msg} /> : null}

      <Card>
        <Text style={styles.title}>Export</Text>
        <Text style={styles.body}>
          Save a copy of your data as JSON or CSV (via the system share sheet).
        </Text>
        <View style={styles.btnRow}>
          <SecondaryButton label="Export JSON" onPress={exportJSON} disabled={isExporting} />
          <SecondaryButton label="Export CSV" onPress={exportCSV} disabled={isExporting} />
        </View>
        <Text style={styles.meta}>{entries.length} entries</Text>
      </Card>

      <Card>
        <Text style={styles.title}>Units</Text>
        <Text style={styles.body}>Choose how hydration is recorded.</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Cups</Text>
          <Switch
            value={settings.hydrationUnit === 'oz'}
            onValueChange={async (v) => {
              setBanner(null);
              try {
                await update({ hydrationUnit: v ? 'oz' : 'cups' });
                setBanner({ tone: 'success', msg: `Hydration unit set to ${v ? 'oz' : 'cups'}.` });
              } catch (e) {
                setBanner({
                  tone: 'error',
                  msg: e instanceof Error ? e.message : 'Could not update units.',
                });
              }
            }}
          />
          <Text style={styles.rowLabel}>Oz</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.title}>Danger zone</Text>
        <Text style={styles.body}>Clear all local data from this device.</Text>
        <View style={{ marginTop: Spacing.md }}>
          <PrimaryButton label="Clear all data" onPress={confirmClearAll} tone="danger" />
        </View>
      </Card>

      <Card>
        <Text style={styles.title}>About</Text>
        <Text style={styles.body}>Rebound is a simple daily recovery + wellbeing tracker.</Text>
        <Text style={[styles.meta, { marginTop: 10 }]}>Version {appVersion}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  body: { fontSize: 14, color: Colors.mutedText },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: Spacing.md },
  meta: { fontSize: 12, color: Colors.mutedText, marginTop: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  rowLabel: { fontSize: 14, fontWeight: '700', color: Colors.text },
});

