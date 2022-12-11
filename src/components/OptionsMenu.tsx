import { signOut } from "@data/auth";
import { Entypo } from "@expo/vector-icons";
import { Menu } from "native-base";
import { Pressable } from "react-native";

export default function OptionsMenu() {
  return (
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
    </Menu>
  );
}
