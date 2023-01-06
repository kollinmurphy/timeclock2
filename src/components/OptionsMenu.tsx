import { signOut } from "@data/auth";
import { Entypo } from "@expo/vector-icons";
import { Menu } from "native-base";
import { useCallback, useState } from "react";
import { Pressable } from "react-native";
import DeleteAccountModal from "./DeleteAccountModal";

export default function OptionsMenu() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const toggleModal = useCallback(() => {
    setShowDeleteAccountModal((show) => !show);
  }, []);

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
            <Entypo name="dots-three-horizontal" size={18} />
          </Pressable>
        )}
      >
        <Menu.Item onPress={signOut}>Sign Out</Menu.Item>
        <Menu.Item onPress={toggleModal}>Delete Account</Menu.Item>
      </Menu>
      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onDismiss={toggleModal}
      />
    </>
  );
}
