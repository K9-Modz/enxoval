import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { ROOMS } from '@/lib/data';
import * as Haptics from 'expo-haptics';

export default function GuestDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { items, logout } = useApp();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const stats = useMemo(() => {
    const total = items.length;
    const available = items.filter((i) => i.status === 'available').length;
    const reserved = items.filter((i) => i.status === 'reserved').length;
    const gifted = items.filter((i) => i.status === 'gifted').length;
    return { total, available, reserved, gifted };
  }, [items]);

  const roomStats = useMemo(() => {
    return ROOMS.map((room) => {
      const roomItems = items.filter((i) => i.room === room.id);
      const available = roomItems.filter((i) => i.status === 'available').length;
      return { ...room, total: roomItems.length, available };
    });
  }, [items]);

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logout();
    router.replace('/');
  };

  const renderRoomIcon = (room: typeof roomStats[0], size: number, color: string) => {
    if (room.iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={room.icon as any} size={size} color={color} />;
    }
    return <Ionicons name={room.icon as any} size={size} color={color} />;
  };

  return (
    <View style={[styles.container, {
      paddingTop: (insets.top || webTopInset) + 8,
    }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Lista de Presentes</Text>
          <Text style={styles.headerSubtitle}>Escolha um presente para o casal</Text>
        </View>
        <Pressable onPress={handleLogout} hitSlop={12}>
          <Ionicons name="log-out-outline" size={24} color={Colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, {
          paddingBottom: (insets.bottom || webBottomInset) + 20,
        }]}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.availableLight }]}>
            <Text style={[styles.statNumber, { color: Colors.textSecondary }]}>{stats.available}</Text>
            <Text style={styles.statLabel}>Disponíveis</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.reservedLight }]}>
            <Text style={[styles.statNumber, { color: Colors.reserved }]}>{stats.reserved}</Text>
            <Text style={styles.statLabel}>Reservados</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.giftedLight }]}>
            <Text style={[styles.statNumber, { color: Colors.gifted }]}>{stats.gifted}</Text>
            <Text style={styles.statLabel}>Presenteados</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionTitle}>Escolha um cômodo</Text>
        </Animated.View>

        {roomStats.map((room, index) => (
          <Animated.View key={room.id} entering={FadeInDown.delay(300 + index * 60).duration(500)}>
            <Pressable
              style={({ pressed }) => [
                styles.roomCard,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({ pathname: '/room/[roomId]', params: { roomId: room.id } });
              }}
            >
              <View style={styles.roomIconCircle}>
                {renderRoomIcon(room, 22, Colors.accent)}
              </View>
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomCount}>
                  {room.available > 0 ? `${room.available} disponíveis` : 'Nenhum disponível'}
                </Text>
              </View>
              {room.available > 0 && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableBadgeText}>{room.available}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginTop: 8,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 12,
  },
  roomIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  roomCount: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  availableBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  availableBadgeText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textLight,
  },
});
