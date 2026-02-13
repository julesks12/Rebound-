import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Colors } from '../theme/colors';

export function SettingsScreen() {
  return (
    <Screen scroll>
      <Card>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.body}>Export, units, and data reset will be implemented next.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  body: { fontSize: 14, color: Colors.mutedText },
});

