import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

export function InlineBanner({
  tone,
  message,
}: {
  tone: 'success' | 'error' | 'info';
  message: string;
}) {
  const bg =
    tone === 'success' ? '#DCFCE7' : tone === 'error' ? '#FEE2E2' : '#E0F2FE';
  const fg =
    tone === 'success' ? Colors.success : tone === 'error' ? Colors.danger : '#0369A1';

  return (
    <View style={[styles.wrap, { backgroundColor: bg, borderColor: fg }]}>
      <Text style={[styles.text, { color: fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

