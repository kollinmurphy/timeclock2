import { deleteAccount } from "@data/auth";
import { useAccount } from "@hooks/useAccount";
import { Button, Input, Modal, Text, VStack } from "native-base";
import { useCallback, useState } from "react";
import Show from "./Show";

export default function DeleteAccountModal(props: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const account = useAccount();
  const [password, setPassword] = useState("");

  const handleDelete = useCallback(() => {
    deleteAccount(password);
  }, [password]);

  return (
    <Modal isOpen={props.visible} onClose={props.onDismiss} size="lg">
      <Modal.Content>
        <Modal.Header>Delete account</Modal.Header>
        <Modal.Body>
          <VStack space={3}>
            <Text>
              If you choose to delete your account, all of your timesheet data
              will be deleted. This action cannot be undone.
            </Text>
            <Show when={!account.anonymous}>
              <Text mb={3}>
                To delete your account, please enter your password below.
              </Text>
              <Input
                placeholder="Password"
                onChangeText={setPassword}
                type="password"
                autoCapitalize="none"
              />
            </Show>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="danger" onPress={handleDelete}>
              Delete
            </Button>
            <Button onPress={props.onDismiss} colorScheme="primary">
              Cancel
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
