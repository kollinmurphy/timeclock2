import ContinueAsGuestButton from "@components/ContinueAsGuest";
import ErrorAlert from "@components/ErrorAlert";
import { createAcount } from "@data/auth";
import { useAccount } from "@hooks/useAccount";
import { useNavigation } from "@react-navigation/native";
import { Button, Heading, Input, ScrollView, Text, VStack } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUp() {
  const navigation = useNavigation();
  const account = useAccount();
  const insets = useSafeAreaInsets();

  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (account.user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "dashboard" as never }],
      });
    }
  }, [account.user]);

  const handleSignUp = useCallback(async () => {
    setStatus("loading");
    try {
      await createAcount(credentials.email, credentials.password);
    } catch (err) {
      setError(err.message);
    }
    setStatus("idle");
  }, [credentials]);

  const navigateToSignIn = useCallback(
    () => navigation.navigate("signin" as never),
    []
  );

  const handleEmailBlur = useCallback(() => {
    setTimeout(() => setEmailFocused(false), 100);
  }, []);

  const handlePasswordBlur = useCallback(() => {
    setTimeout(() => setPasswordFocused(false), 100);
  }, []);

  const handleEmailFocus = useCallback(() => setEmailFocused(true), []);

  const handlePasswordFocus = useCallback(() => setPasswordFocused(true), []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <ScrollView width="100%" flex={1} p={4}>
        <VStack space={3} flex={1}>
          <Heading>Welcome to ClockWork!</Heading>
          <Text fontSize="md">
            ClockWork is a simple time tracking app that helps you keep track of
            your time.
          </Text>
          <Text fontSize="md">
            To get started, please create an account or sign in if you already
            have one.
          </Text>
          <Input
            placeholder="Email"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(email) => setCredentials((c) => ({ ...c, email }))}
            size="xl"
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
          />
          <Input
            placeholder="Password"
            onChangeText={(password) =>
              setCredentials((c) => ({ ...c, password }))
            }
            type="password"
            size="xl"
            autoCapitalize="none"
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
          />
          <Button
            onPress={handleSignUp}
            size="lg"
            disabled={status === "loading"}
            colorScheme={status === "loading" ? "gray" : undefined}
          >
            Sign Up
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onPress={navigateToSignIn}
            disabled={status === "loading"}
          >
            Sign In Instead
          </Button>
          <ErrorAlert error={error} />
        </VStack>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 10,
          paddingBottom: 0,
          display: emailFocused || passwordFocused ? "none" : "flex",
          marginBottom: insets.bottom,
        }}
      >
        <ContinueAsGuestButton />
      </View>
    </View>
  );
}
