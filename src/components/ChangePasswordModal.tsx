import { changePassword } from "@data/auth";
import { Button, Input, Modal, Text, VStack } from "native-base";
import { useCallback, useState } from "react";
import ErrorAlert from "./ErrorAlert";

export default function ChangePasswordModal(props: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const handleSubmit = useCallback(async () => {
    if (newPassword !== confirmPassword)
      return setError("New passwords don't match");
    try {
      setError("");
      setStatus("loading");
      await changePassword(password, newPassword);
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      props.onDismiss();
    } catch (err) {
      setError(err.message);
    }
    setStatus("idle");
  }, [password, newPassword, confirmPassword]);

  return (
    <Modal isOpen={props.visible} onClose={props.onDismiss} size="lg">
      <Modal.Content>
        <Modal.Header>Change Password</Modal.Header>
        <Modal.Body>
          <VStack space={3}>
            <Text>
              Please enter your current password and your new password below.
            </Text>
            <Input
              placeholder="Current Password"
              value={password}
              onChangeText={setPassword}
              type="password"
              autoCapitalize="none"
            />
            <Input
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              type="password"
              autoCapitalize="none"
            />
            <Input
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              type="password"
              autoCapitalize="none"
            />
            <ErrorAlert error={error} />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="emerald"
              onPress={props.onDismiss}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmit}
              colorScheme={status === "loading" ? "gray" : "primary"}
              disabled={status === "loading"}
            >
              Change
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
