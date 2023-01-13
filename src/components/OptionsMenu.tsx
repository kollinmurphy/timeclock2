import { signOut } from "@data/auth";
import { Entypo } from "@expo/vector-icons";
import { useAccount } from "@hooks/useAccount";
import useIsDarkMode from "@hooks/useIsDarkMode";
import { Menu } from "native-base";
import { useCallback, useState } from "react";
import { Pressable } from "react-native";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import Show from "./Show";

export default function OptionsMenu() {
  const dark = useIsDarkMode();
  const account = useAccount();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showChangePasswordModal, setShowPasswordModal] = useState(false);

  const toggleDeleteModal = useCallback(() => {
    setShowDeleteAccountModal((show) => !show);
  }, []);

  const toggleChangePasswordModal = useCallback(
    () => setShowPasswordModal((s) => !s),
    []
  );

  return (
    <>
      <Menu
        w="190"
        trigger={(triggerProps) => (
          <Pressable
            accessibilityLabel="More options menu"
            {...triggerProps}
            style={({ pressed }) => [
              triggerProps.style,
              pressed ? { opacity: 0.4, backgroundColor: "gray" } : {},
              {
                padding: 4,
                borderRadius: 20,
              },
            ]}
          >
            <Entypo
              name="dots-three-horizontal"
              size={18}
              color={dark ? "white" : "black"}
            />
          </Pressable>
        )}
      >
        <Show when={!account.anonymous}>
          <Menu.Item onPress={signOut}>Sign Out</Menu.Item>
          <Menu.Item onPress={toggleChangePasswordModal}>
            Change Password
          </Menu.Item>
        </Show>
        <Menu.Item onPress={toggleDeleteModal}>Delete Account</Menu.Item>
      </Menu>
      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onDismiss={toggleDeleteModal}
      />
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onDismiss={toggleChangePasswordModal}
      />
    </>
  );
}
