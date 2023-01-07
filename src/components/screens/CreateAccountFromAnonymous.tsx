import ErrorAlert from "@components/ErrorAlert";
import { linkCredential } from "@data/auth";
import { useAccount } from "@hooks/useAccount";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Modal, ScrollView, Text, VStack } from "native-base";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

export default function CreateAccountFromAnonymous() {
  const navigation = useNavigation();
  const account = useAccount();

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = useCallback(async () => {
    setStatus("loading");
    try {
      await linkCredential(credentials.email, credentials.password);
      setStatus("success");
      account.setAnonymous(false);
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }, [credentials]);

  const handleClose = useCallback(() => {
    setStatus("idle");
    setError(null);
    navigation.goBack();
  }, [navigation]);

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
          <Text fontSize="md">
            To get started, please enter an email and a password.
          </Text>
          <Input
            placeholder="Email"
            autoCorrect={false}
            autoCapitalize="none"
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
      <Modal isOpen={status === "success"} onClose={handleClose} size="lg">
        <Modal.Content>
          <Modal.Header>Welcome!</Modal.Header>
          <Modal.Body>
            <Text>
              You have successfully created an account. You can now use your
              email and password to sign in.
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button onPress={handleClose} colorScheme="primary">
                Okay
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
}
