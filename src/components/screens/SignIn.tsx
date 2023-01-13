import ErrorAlert from "@components/ErrorAlert";
import ForgotPasswordModal from "@components/ForgotPasswordModal";
import { signIn } from "@data/auth";
import { Button, Input, ScrollView, View, VStack } from "native-base";
import { useCallback, useState } from "react";

export default function SignIn() {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = useCallback(async () => {
    setStatus("loading");
    try {
      await signIn(credentials.email, credentials.password);
    } catch (err) {
      setError(err.message);
    }
    setStatus("idle");
  }, [credentials]);

  const toggleForgotPassword = useCallback(
    () => setShowForgotPassword((s) => !s),
    []
  );

  return (
    <View
      style={{ flex: 1, alignItems: "center" }}
      _dark={{
        backgroundColor: "black",
      }}
      _light={{
        backgroundColor: "gray.50",
      }}
    >
      <ScrollView width="100%" flex={1} p={4}>
        <VStack space={3}>
          <Input
            placeholder="Email"
            autoCapitalize="none"
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
            size="lg"
            onPress={toggleForgotPassword}
            disabled={status === "loading"}
          >
            Forgot Password?
          </Button>
          <ErrorAlert error={error} />
          <ForgotPasswordModal
            visible={showForgotPassword}
            onDismiss={toggleForgotPassword}
            email={credentials.email}
          />
        </VStack>
      </ScrollView>
    </View>
  );
}
