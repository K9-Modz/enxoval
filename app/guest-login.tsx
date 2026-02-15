import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/AppContext';
import * as Haptics from 'expo-haptics';

export default function GuestLoginScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setRole, verifyCode } = useApp();

  const handleLogin = async () => {
    if (!code.trim()) {
      setError('Digite o código do convite');
      return;
    }
    setLoading(true);
    setError('');

    const valid = await verifyCode(code.trim(), 'guest');
    if (valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await setRole('guest');
      router.dismissAll();
      router.replace('/guest-dashboard');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Código inválido. Verifique com o casal.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="gift" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Olá, convidado!</Text>
        <Text style={styles.subtitle}>
          Digite o código do convite para ver a lista de presentes do enxoval.
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder="Código do convite"
            placeholderTextColor={Colors.textTertiary}
            value={code}
            onChangeText={(t) => { setCode(t); setError(''); }}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            autoFocus
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />
        </View>

        {!!error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={16} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            loading && { opacity: 0.7 },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textLight} />
          ) : (
            <Text style={styles.buttonText}>Ver Lista</Text>
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
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
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
  hint: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textLight,
  },
});
