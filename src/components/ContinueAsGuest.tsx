import { anonymousSignIn } from "@data/auth";
import { useAccount } from "@hooks/useAccount";
import { Button, Modal, Text, View } from "native-base";
import { useCallback, useState } from "react";

export default function ContinueAsGuestButton() {
  const account = useAccount();
  const [showDialog, setShowDialog] = useState(false);

  const handleNavigate = useCallback(async () => {
    await anonymousSignIn();
    account.setAnonymous(true);
  }, []);

  const toggleDialog = useCallback(() => setShowDialog((s) => !s), []);

  return (
    <View>
      <Button variant="ghost" size="sm" onPress={toggleDialog}>
        Continue as guest
      </Button>
      <Modal isOpen={showDialog} onClose={toggleDialog} size="lg">
        <Modal.Content>
          <Modal.Header>Continue as guest</Modal.Header>
          <Modal.Body>
            <Text mb={3}>
              If you choose to continue as a guest, we will do our best to
              provide you with the best experience possible. However,{" "}
              <Text fontWeight="bold">
                we cannot guarantee that your timesheet data will be saved.
              </Text>
            </Text>
            <Text>
              Signing up for an account is quick and easy! We only need an email
              address and a password, and we'll never share your data with a
              third party. You'll be able to delete your account and its
              associated data at any time.
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={handleNavigate}
              >
                Continue as guest
              </Button>
              <Button onPress={toggleDialog} colorScheme="primary">
                Sign Up
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
}
