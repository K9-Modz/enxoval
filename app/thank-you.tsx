import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import Colors from '@/constants/colors';

export default function ThankYouScreen() {
  const { itemName } = useLocalSearchParams<{ itemName: string }>();

  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.delay(100).duration(500)} style={styles.iconCircle}>
        <Ionicons name="heart" size={40} color={Colors.accent} />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300).duration(500)}>
        <Text style={styles.title}>Obrigado!</Text>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(500).duration(500)}>
        <Text style={styles.message}>
          Seu presente foi reservado com sucesso.{'\n'}
          O casal ficará muito feliz!
        </Text>
      </Animated.View>

      {itemName && (
        <Animated.View entering={FadeIn.delay(600).duration(500)} style={styles.itemBadge}>
          <Ionicons name="gift" size={16} color={Colors.primary} />
          <Text style={styles.itemBadgeText}>{itemName}</Text>
        </Animated.View>
      )}

      <Animated.View entering={FadeIn.delay(700).duration(500)} style={{ width: '100%' }}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  itemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight + '40',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  itemBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: Colors.primary,
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
