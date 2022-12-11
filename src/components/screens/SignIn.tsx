import ErrorAlert from "@components/ErrorAlert";
import { signIn } from "@data/auth";
import { useAccount } from "@hooks/useAccount";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, ScrollView, VStack } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

export default function SignIn() {
  const navigation = useNavigation();
  const account = useAccount();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

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

  const handleSignIn = useCallback(async () => {
    setStatus("loading");
    try {
      await signIn(credentials.email, credentials.password);
    } catch (err) {
      setError(err.message);
    }
    setStatus("idle");
  }, [credentials]);

  const navigateToSignUp = useCallback(
    () => navigation.navigate("signup" as never),
    []
  );

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
            onPress={handleSignIn}
            size="lg"
            disabled={status === "loading"}
            colorScheme={status === "loading" ? "gray" : undefined}
          >
            Sign In
          </Button>
          <Button
            variant="ghost"
            onPress={navigateToSignUp}
            disabled={status === "loading"}
          >
            Sign Up
          </Button>
          <ErrorAlert error={error} />
        </VStack>
      </ScrollView>
    </View>
  );
}
