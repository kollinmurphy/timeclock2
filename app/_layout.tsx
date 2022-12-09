import { AuthProvider } from "@hooks/useAccount";
import { Stack } from "expo-router";
import { NativeBaseProvider } from "native-base";
import React from "react";

export default function Layout() {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <Stack />
      </AuthProvider>
    </NativeBaseProvider>
  );
}
