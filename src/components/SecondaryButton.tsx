import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

export function SecondaryButton({
  label,
  onPress,
  disabled,
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});

