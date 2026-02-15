import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import type { ItemStatus } from '@/lib/data';

interface StatusBadgeProps {
  status: ItemStatus;
  compact?: boolean;
  coupleView?: boolean;
}

const GUEST_STATUS_CONFIG = {
  available: {
    label: 'Disponível',
    color: Colors.available,
    bgColor: Colors.availableLight,
    icon: 'ellipse-outline' as const,
  },
  reserved: {
    label: 'Reservado',
    color: Colors.reserved,
    bgColor: Colors.reservedLight,
    icon: 'time-outline' as const,
  },
  gifted: {
    label: 'Presenteado',
    color: Colors.gifted,
    bgColor: Colors.giftedLight,
    icon: 'checkmark-circle' as const,
  },
};

const COUPLE_STATUS_CONFIG = {
  available: {
    label: 'Falta comprar',
    color: Colors.available,
    bgColor: Colors.availableLight,
    icon: 'ellipse-outline' as const,
  },
  reserved: {
    label: 'Reservado',
    color: Colors.reserved,
    bgColor: Colors.reservedLight,
    icon: 'time-outline' as const,
  },
  gifted: {
    label: 'Já comprado',
    color: Colors.gifted,
    bgColor: Colors.giftedLight,
    icon: 'checkmark-circle' as const,
  },
};

export default function StatusBadge({ status, compact, coupleView }: StatusBadgeProps) {
  const config = coupleView ? COUPLE_STATUS_CONFIG[status] : GUEST_STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
      <Ionicons name={config.icon} size={compact ? 12 : 14} color={config.color} />
      {!compact && <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
