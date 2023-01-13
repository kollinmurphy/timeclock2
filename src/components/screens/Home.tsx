import useIsDarkMode from "@hooks/useIsDarkMode";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAccount } from "../../hooks/useAccount";

export default function Home() {
  const navigation = useNavigation();
  const account = useAccount();
  const dark = useIsDarkMode();

  useEffect(() => {
    if (account.status === "loading") return;
    if (account.user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "dashboard" as never }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "signup" as never }],
      });
    }
  }, [account]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: dark ? "black" : "white",
      }}
    >
      <ActivityIndicator />
    </View>
  );
}
