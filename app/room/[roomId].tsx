import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { ROOMS, GiftItem } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import * as Haptics from 'expo-haptics';

function CoupleItemCard({ item, onToggleBought, onDelete, onUnreserve }: {
  item: GiftItem;
  onToggleBought: (item: GiftItem) => void;
  onDelete: (item: GiftItem) => void;
  onUnreserve: (item: GiftItem) => void;
}) {
  const isBought = item.status === 'gifted';
  const isReserved = item.status === 'reserved';

  return (
    <View style={[styles.itemCard, isBought && styles.itemCardBought]}>
      <View style={styles.itemTop}>
        <Pressable
          style={({ pressed }) => [
            styles.checkCircle,
            isBought && styles.checkCircleActive,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => onToggleBought(item)}
          hitSlop={8}
        >
          {isBought && <Ionicons name="checkmark" size={16} color={Colors.textLight} />}
        </Pressable>
        <Text style={[styles.itemName, isBought && styles.itemNameBought]}>{item.name}</Text>
        <StatusBadge status={item.status} coupleView />
      </View>

      {item.guestName && (
        <View style={styles.guestInfo}>
          <Ionicons name="person-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.guestName}>{item.guestName}</Text>
          {item.guestMessage ? (
            <Text style={styles.guestMessage} numberOfLines={1}>- "{item.guestMessage}"</Text>
          ) : null}
        </View>
      )}

      <View style={styles.itemActions}>
        {isReserved && (
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.8 }]}
            onPress={() => onUnreserve(item)}
          >
            <Ionicons name="close" size={16} color={Colors.textSecondary} />
            <Text style={[styles.actionText, { color: Colors.textSecondary }]}>Cancelar reserva</Text>
          </Pressable>
        )}
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.8 }]}
          onPress={() => onDelete(item)}
        >
          <Ionicons name="trash-outline" size={16} color={Colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

function GuestItemCard({ item, onGift }: {
  item: GiftItem;
  onGift: (item: GiftItem) => void;
}) {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemTop}>
        <Text style={styles.itemName}>{item.name}</Text>
        <StatusBadge status={item.status} />
      </View>

      {item.guestName && (
        <View style={styles.guestInfo}>
          <Ionicons name="person-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.guestName}>{item.guestName}</Text>
        </View>
      )}

      {item.status === 'available' && (
        <View style={styles.itemActions}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.giftButton, pressed && { opacity: 0.8 }]}
            onPress={() => onGift(item)}
          >
            <Ionicons name="gift-outline" size={16} color={Colors.accent} />
            <Text style={[styles.actionText, { color: Colors.accent }]}>Vou presentear</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function RoomDetailScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const insets = useSafeAreaInsets();
  const { items, role, deleteItem, markAsGifted, unreserveItem, updateItem } = useApp();
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const room = ROOMS.find((r) => r.id === roomId);
  const isCouple = role === 'couple';

  const roomItems = useMemo(() => {
    return items.filter((i) => i.room === roomId);
  }, [items, roomId]);

  const renderRoomIcon = () => {
    if (!room) return null;
    if (room.iconFamily === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={room.icon as any} size={22} color={Colors.primary} />;
    }
    return <Ionicons name={room.icon as any} size={22} color={Colors.primary} />;
  };

  const handleDelete = (item: GiftItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Remover item',
      `Deseja remover "${item.name}" da lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => deleteItem(item.id),
        },
      ]
    );
  };

  const handleToggleBought = async (item: GiftItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (item.status === 'gifted') {
      await updateItem(item.id, { status: 'available' });
    } else {
      await markAsGifted(item.id);
    }
  };

  const handleUnreserve = async (item: GiftItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await unreserveItem(item.id);
  };

  const handleGift = (item: GiftItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/gift-item', params: { itemId: item.id, itemName: item.name } });
  };

  if (!room) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={roomItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, {
          paddingBottom: (insets.bottom || webBottomInset) + 20,
        }]}
        ListHeaderComponent={
          <View style={styles.roomHeader}>
            <View style={styles.roomIconLarge}>
              {renderRoomIcon()}
            </View>
            <Text style={styles.roomTitle}>{room.name}</Text>
            <Text style={styles.roomSubtitle}>
              {roomItems.length} {roomItems.length === 1 ? 'item' : 'itens'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>Nenhum item neste cômodo</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
            {isCouple ? (
              <CoupleItemCard
                item={item}
                onToggleBought={handleToggleBought}
                onDelete={handleDelete}
                onUnreserve={handleUnreserve}
              />
            ) : (
              <GuestItemCard
                item={item}
                onGift={handleGift}
              />
            )}
          </Animated.View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      {isCouple && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.95 }] }]}
          onPress={() => router.push({ pathname: '/add-item', params: { roomId } })}
        >
          <Ionicons name="add" size={28} color={Colors.textLight} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  roomHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  roomIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roomTitle: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
  },
  roomSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  itemCardBought: {
    backgroundColor: Colors.giftedLight,
    borderColor: Colors.gifted + '30',
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.available,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: Colors.gifted,
    borderColor: Colors.gifted,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    flex: 1,
  },
  itemNameBought: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 38,
    gap: 6,
  },
  guestName: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  guestMessage: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textTertiary,
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 38,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    gap: 4,
  },
  giftButton: {
    backgroundColor: Colors.accentLight,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textTertiary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
});
