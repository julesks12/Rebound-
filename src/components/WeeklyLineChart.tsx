import React, { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

type Point = { x: number; y: number; value: number; label: string };

function buildLinePath(points: Array<Point | null>) {
  let d = '';
  let started = false;
  for (const p of points) {
    if (!p) {
      started = false;
      continue;
    }
    if (!started) {
      d += `M ${p.x} ${p.y} `;
      started = true;
    } else {
      d += `L ${p.x} ${p.y} `;
    }
  }
  return d.trim();
}

export function WeeklyLineChart({
  labels,
  moodValues,
  energyValues,
}: {
  labels: string[]; // length N (e.g., 7)
  moodValues: Array<number | null>;
  energyValues: Array<number | null>;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(280, Math.min(520, windowWidth - Spacing.md * 2 - 32));
  const height = 140;
  const padding = 14;

  const moodPoints = useMemo(() => {
    const n = labels.length;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;
    return labels.map((label, i) => {
      const v = moodValues[i];
      if (v == null) return null;
      const x = padding + (innerW * i) / Math.max(1, n - 1);
      const y = padding + innerH * (1 - (v - 1) / 9);
      return { x, y, value: v, label };
    });
  }, [labels, moodValues]);

  const energyPoints = useMemo(() => {
    const n = labels.length;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;
    return labels.map((label, i) => {
      const v = energyValues[i];
      if (v == null) return null;
      const x = padding + (innerW * i) / Math.max(1, n - 1);
      const y = padding + innerH * (1 - (v - 1) / 9);
      return { x, y, value: v, label };
    });
  }, [labels, energyValues]);

  const moodPath = useMemo(() => buildLinePath(moodPoints), [moodPoints]);
  const energyPath = useMemo(() => buildLinePath(energyPoints), [energyPoints]);

  return (
    <View style={styles.wrap}>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Mood</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Energy</Text>
        </View>
      </View>

      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path d={moodPath} stroke={Colors.primary} strokeWidth={3} fill="none" />
        <Path d={energyPath} stroke="#10B981" strokeWidth={3} fill="none" />

        {moodPoints.map((p, idx) =>
          p ? (
            <Circle key={`m-${idx}`} cx={p.x} cy={p.y} r={3.5} fill={Colors.primary} />
          ) : null
        )}
        {energyPoints.map((p, idx) =>
          p ? <Circle key={`e-${idx}`} cx={p.x} cy={p.y} r={3.5} fill="#10B981" /> : null
        )}
      </Svg>

      <View style={styles.xLabels}>
        {labels.map((l) => (
          <Text key={l} style={styles.xLabel} numberOfLines={1}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  legend: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  legendItem: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 10 },
  legendText: { fontSize: 12, color: Colors.mutedText, fontWeight: '600' },
  xLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  xLabel: { fontSize: 11, color: Colors.mutedText, width: 40, textAlign: 'center' },
});

