import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import * as Haptics from 'expo-haptics';

export default function GiftItemScreen() {
  const { itemId, itemName } = useLocalSearchParams<{ itemId: string; itemName: string }>();
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { reserveItem } = useApp();

  const handleConfirm = async () => {
    if (!guestName.trim()) {
      setError('Por favor, digite seu nome');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await reserveItem(itemId!, guestName.trim(), guestMessage.trim() || undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
      setTimeout(() => {
        router.push({ pathname: '/thank-you', params: { itemName: itemName } });
      }, 300);
    } catch (e: any) {
      setError(e?.message || 'Erro ao reservar item. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="gift" size={28} color={Colors.accent} />
        </View>
        <Text style={styles.title}>Presentear</Text>
        <Text style={styles.itemName}>{itemName}</Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Seu nome *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor={Colors.textTertiary}
            value={guestName}
            onChangeText={(t) => { setGuestName(t); setError(''); }}
            autoFocus
          />
        </View>

        <View>
          <Text style={styles.label}>Mensagem para o casal</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Deixe uma mensagem carinhosa (opcional)"
            placeholderTextColor={Colors.textTertiary}
            value={guestMessage}
            onChangeText={setGuestMessage}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {!!error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            loading && { opacity: 0.7 },
          ]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textLight} />
          ) : (
            <>
              <Ionicons name="heart" size={18} color={Colors.textLight} />
              <Text style={styles.confirmText}>Confirmar Presente</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
  },
  itemName: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    marginTop: 4,
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
  messageInput: {
    height: 80,
    paddingTop: 14,
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
  confirmButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textLight,
  },
});
