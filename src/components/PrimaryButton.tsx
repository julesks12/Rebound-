import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  tone = 'primary',
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'primary' | 'danger';
  testID?: string;
}) {
  const isDisabled = disabled || loading;
  const bg = tone === 'danger' ? Colors.danger : Colors.primary;
  const bgPressed = tone === 'danger' ? '#B91C1C' : Colors.primaryPressed;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg },
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && { backgroundColor: bgPressed },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator color="#fff" style={styles.spinner} /> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spinner: {
    marginRight: 6,
  },
});

