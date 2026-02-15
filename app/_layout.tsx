import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AppProvider } from "@/lib/AppContext";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, headerBackTitle: "Voltar" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="couple-login" options={{ presentation: "modal", headerShown: true, title: "Área do Casal" }} />
      <Stack.Screen name="guest-login" options={{ presentation: "modal", headerShown: true, title: "Área do Convidado" }} />
      <Stack.Screen name="couple-dashboard" />
      <Stack.Screen name="guest-dashboard" />
      <Stack.Screen name="room/[roomId]" options={{ headerShown: true, headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen
        name="gift-item"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.55],
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-item"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.5, 0.85],
          sheetGrabberVisible: true,
          headerShown: false,
          sheetExpandsWhenScrolledToEdge: true,
        }}
      />
      <Stack.Screen
        name="thank-you"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.45],
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <KeyboardProvider>
            <AppProvider>
              <StatusBar style="dark" />
              <RootLayoutNav />
            </AppProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
