import { Ionicons } from "@expo/vector-icons";
import useIsDarkMode from "@hooks/useIsDarkMode";
import { Button, theme, View } from "native-base";
import { useState } from "react";
import AddHoursModal from "./AddHoursModal";

export default function AddHours() {
  const [open, setOpen] = useState(false);
  const dark = useIsDarkMode();

  return (
    <View
      style={{
        marginBottom: theme.space[2],
      }}
    >
      <Button
        colorScheme="emerald"
        variant="ghost"
        onPress={() => setOpen(true)}
        leftIcon={
          <Ionicons
            name="add"
            size={22}
            color={dark ? theme.colors.emerald[300] : theme.colors.emerald[700]}
          />
        }
        _text={{
          color: dark ? "emerald.300" : "emerald.700",
        }}
      >
        Add Hours
      </Button>
      <AddHoursModal open={open} onClose={() => setOpen(false)} />
    </View>
  );
}
