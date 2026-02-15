import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import { ROOMS } from '@/lib/data';
import * as Haptics from 'expo-haptics';

export default function AddItemScreen() {
  const { roomId: preselectedRoom } = useLocalSearchParams<{ roomId?: string }>();
  const [name, setName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(preselectedRoom || ROOMS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addItem } = useApp();

  const handleAdd = async () => {
    if (!name.trim()) {
      setError('Digite o nome do item');
      return;
    }
    setLoading(true);
    setError('');
    await addItem({
      name: name.trim(),
      room: selectedRoom,
      status: 'available',
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <Ionicons name="add-circle" size={32} color={Colors.primary} />
          <Text style={styles.title}>Novo Item</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Nome do item *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Jogo de toalhas"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={(t) => { setName(t); setError(''); }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
          </View>

          <View>
            <Text style={styles.label}>Cômodo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomScroll}>
              {ROOMS.map((room) => (
                <Pressable
                  key={room.id}
                  style={[
                    styles.roomChip,
                    selectedRoom === room.id && styles.roomChipActive,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedRoom(room.id);
                  }}
                >
                  <Text style={[
                    styles.roomChipText,
                    selectedRoom === room.id && styles.roomChipTextActive,
                  ]}>
                    {room.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {!!error && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={14} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleAdd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textLight} />
            ) : (
              <Text style={styles.addButtonText}>Adicionar Item</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  roomScroll: {
    marginBottom: 4,
  },
  roomChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginRight: 8,
  },
  roomChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roomChipText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  roomChipTextActive: {
    color: Colors.textLight,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: Colors.danger,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textLight,
  },
});
