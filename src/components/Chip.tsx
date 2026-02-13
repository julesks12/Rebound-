import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  selected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  unselected: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textSelected: {
    color: '#1D4ED8',
  },
  textUnselected: {
    color: Colors.text,
  },
});

