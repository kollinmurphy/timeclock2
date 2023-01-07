import { resetPassword } from "@data/auth";
import { Button, Input, Modal, Text, VStack } from "native-base";
import { useCallback, useState } from "react";
import ErrorAlert from "./ErrorAlert";
import Show from "./Show";

export default function ForgotPasswordModal(props: {
  visible: boolean;
  onDismiss: () => void;
  email: string;
}) {
  const [email, setEmail] = useState(props.email);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  const handleSend = useCallback(async () => {
    if (!email) return setError("Please enter your email address");
    try {
      setError(null);
      setStatus("loading");
      await resetPassword(email);
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }, [email]);

  return (
    <Modal isOpen={props.visible} onClose={props.onDismiss} size="lg">
      <Modal.Content>
        <Modal.Header>Send password reset email</Modal.Header>
        <Modal.Body>
          <Show
            when={status !== "sent"}
            fallback={
              <Text>
                We have sent you an email with a link to reset your password. If
                you do not receive an email, please check your spam folder.
                After you reset your password, you will be able to sign in.
              </Text>
            }
          >
            <VStack space={3}>
              <Text>
                We will send you an email with a link to reset your password. If
                you do not receive an email, please check your spam folder.
              </Text>
              <Input
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
              />
              <ErrorAlert error={error} />
            </VStack>
          </Show>
        </Modal.Body>
        <Modal.Footer>
          <Show
            when={status !== "sent"}
            fallback={
              <Button onPress={props.onDismiss} colorScheme="primary">
                Close
              </Button>
            }
          >
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="emerald"
                onPress={props.onDismiss}
              >
                Cancel
              </Button>
              <Button
                onPress={handleSend}
                colorScheme={status === "loading" ? "gray" : "emerald"}
                disabled={status === "loading"}
              >
                Send
              </Button>
            </Button.Group>
          </Show>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
