import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { ROOMS } from '@/lib/data';
import ProgressBar from '@/components/ProgressBar';
import * as Haptics from 'expo-haptics';

export default function CoupleDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { items, logout } = useApp();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const stats = useMemo(() => {
    const total = items.length;
    const bought = items.filter((i) => i.status === 'gifted').length;
    const reserved = items.filter((i) => i.status === 'reserved').length;
    const missing = total - bought - reserved;
    return { total, bought, reserved, missing };
  }, [items]);

  const roomStats = useMemo(() => {
    return ROOMS.map((room) => {
      const roomItems = items.filter((i) => i.room === room.id);
      const total = roomItems.length;
      const bought = roomItems.filter((i) => i.status === 'gifted').length;
      const missing = roomItems.filter((i) => i.status === 'available').length;
      return { ...room, total, bought, missing };
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
          <Text style={styles.greeting}>Olá, casal!</Text>
          <Text style={styles.headerSubtitle}>{stats.total} itens no enxoval</Text>
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
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <ProgressBar total={stats.total} bought={stats.bought} reserved={stats.reserved} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cômodos</Text>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/add-item')}
          >
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </Pressable>
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
                {renderRoomIcon(room, 22, Colors.primary)}
              </View>
              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomCount}>{room.total} itens</Text>
              </View>
              <View style={styles.roomStatusRow}>
                {room.bought > 0 && (
                  <View style={[styles.miniStatus, { backgroundColor: Colors.giftedLight }]}>
                    <Ionicons name="checkmark" size={12} color={Colors.gifted} />
                    <Text style={[styles.miniStatusText, { color: Colors.gifted }]}>{room.bought}</Text>
                  </View>
                )}
                {room.missing > 0 && (
                  <View style={[styles.miniStatus, { backgroundColor: Colors.availableLight }]}>
                    <Text style={[styles.miniStatusText, { color: Colors.textSecondary }]}>{room.missing}</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </Pressable>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(700).duration(500)} style={styles.codeSection}>
          <View style={styles.codeCard}>
            <Ionicons name="key-outline" size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.codeLabel}>Código para convidados</Text>
              <Text style={styles.codeValue}>enxoval123</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(500)}>
          <Text style={styles.codeTip}>Compartilhe o código acima com seus convidados para que eles possam acessar a lista.</Text>
        </Animated.View>
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
    fontSize: 26,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight + '40',
  },
  addButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.primary,
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
  roomStatusRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  miniStatusText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  codeSection: {
    marginTop: 4,
  },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  codeLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  codeValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.primary,
    marginTop: 2,
  },
  codeTip: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
});
