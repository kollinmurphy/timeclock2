import { Stack, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAccount } from "../src/hooks/useAccount";

export default function Home() {
  const navigation = useNavigation();
  const account = useAccount();
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    setTimeout(() => setWaited(true), 1000);
  }, []);

  useEffect(() => {
    if (!waited) return;
    if (account) {
      navigation.reset({
        index: 0,
        routes: [{ name: "dashboard" as never }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "signin" as never }],
      });
    }
  }, [account, waited]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Timeclock" }} />
      <ActivityIndicator />
    </View>
  );
}
