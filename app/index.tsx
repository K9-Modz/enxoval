import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useApp } from '@/lib/AppContext';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { role, loading } = useApp();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  useEffect(() => {
    if (!loading && role === 'couple') {
      router.replace('/couple-dashboard');
    } else if (!loading && role === 'guest') {
      router.replace('/guest-dashboard');
    }
  }, [loading, role]);

  if (loading) return null;
  if (role) return null;

  return (
    <LinearGradient
      colors={['#FFF8F5', '#FFEEE6', '#FFF0EB', '#FFF8F5']}
      style={styles.gradient}
    >
      <View style={[styles.container, {
        paddingTop: (insets.top || webTopInset) + 40,
        paddingBottom: (insets.bottom || webBottomInset) + 20,
      }]}>
        <View style={styles.topSection}>
          <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.iconContainer}>
            <View style={styles.heartContainer}>
              <Ionicons name="heart" size={48} color={Colors.accent} />
              <View style={styles.homeOverlay}>
                <Ionicons name="home" size={22} color={Colors.primary} />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <Text style={styles.title}>Nosso Enxoval</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <Text style={styles.subtitle}>
              Seja bem-vindo(a)! Nosso coração fica ainda mais feliz em compartilhar esse momento com você.
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(800).duration(800)} style={styles.buttonSection}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/couple-login')}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="heart-outline" size={22} color={Colors.textLight} />
              <Text style={styles.primaryButtonText}>Sou o Casal</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/guest-login')}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="gift-outline" size={22} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Sou Convidado</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1000).duration(800)}>
          <Text style={styles.footer}>
            Um presente de cada vez, construindo nosso lar com carinho
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  iconContainer: {
    marginBottom: 8,
  },
  heartContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(212, 135, 127, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.card,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  buttonSection: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: Colors.card,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textLight,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  footer: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
});
