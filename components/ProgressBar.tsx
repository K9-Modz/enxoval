import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Colors from '@/constants/colors';

interface ProgressBarProps {
  total: number;
  bought: number;
  reserved: number;
}

export default function ProgressBar({ total, bought, reserved }: ProgressBarProps) {
  const boughtPercent = total > 0 ? (bought / total) * 100 : 0;
  const reservedPercent = total > 0 ? (reserved / total) * 100 : 0;
  const missing = total - bought - reserved;

  const boughtStyle = useAnimatedStyle(() => ({
    width: withTiming(`${boughtPercent}%` as any, { duration: 600 }),
  }));

  const reservedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${reservedPercent}%` as any, { duration: 600 }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progresso do Enxoval</Text>
        <Text style={styles.percent}>{Math.round(boughtPercent + reservedPercent)}%</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.barBought, boughtStyle]} />
        <Animated.View style={[styles.barReserved, reservedStyle]} />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.gifted }]} />
          <Text style={styles.legendText}>{bought} comprados</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.reserved }]} />
          <Text style={styles.legendText}>{reserved} reservados</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.available }]} />
          <Text style={styles.legendText}>{missing} faltam</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  percent: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.primary,
  },
  track: {
    height: 8,
    backgroundColor: Colors.availableLight,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  barBought: {
    height: '100%',
    backgroundColor: Colors.gifted,
    borderRadius: 4,
  },
  barReserved: {
    height: '100%',
    backgroundColor: Colors.reserved,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
});
