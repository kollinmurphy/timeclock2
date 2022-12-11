import ErrorAlert from "@components/ErrorAlert";
import { Button, Input, ScrollView, VStack } from "native-base";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { createAcount } from "@data/auth";

export default function SignUp() {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = useCallback(async () => {
    setStatus("loading");
    try {
      await createAcount(credentials.email, credentials.password);
    } catch (err) {
      setError(err.message);
    }
    setStatus("idle");
  }, [credentials]);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView width="100%" flex={1} px={2}>
        <VStack space={2}>
          <Input
            placeholder="Email"
            autoCorrect={false}
            onChangeText={(email) => setCredentials((c) => ({ ...c, email }))}
            size="xl"
          />
          <Input
            placeholder="Password"
            onChangeText={(password) =>
              setCredentials((c) => ({ ...c, password }))
            }
            type="password"
            size="xl"
            autoCapitalize="none"
          />
          <Button
            onPress={handleSignUp}
            size="lg"
            disabled={status === "loading"}
            colorScheme={status === "loading" ? "gray" : undefined}
          >
            Sign Up
          </Button>
          <ErrorAlert error={error} />
        </VStack>
      </ScrollView>
    </View>
  );
}
