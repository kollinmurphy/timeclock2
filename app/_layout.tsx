import { AuthProvider } from "@hooks/useAccount";
import { Stack } from "expo-router";
import { extendTheme, NativeBaseProvider } from "native-base";
import React from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
    },
  },
});

export default function Layout() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title='PRESS ME' />
    </View>
  )
  return (
    <NativeBaseProvider theme={theme}>
      <AuthProvider>
        <SafeAreaView
          edges={['bottom']}
          style={{
            flex: 1,
            backgroundColor: theme.colors.muted[100],
          }}
        >
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: theme.colors.muted[100],
              },
            }}
          />
        </SafeAreaView>
      </AuthProvider>
    </NativeBaseProvider>
  );
}
