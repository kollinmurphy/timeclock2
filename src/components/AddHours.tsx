import { Ionicons } from "@expo/vector-icons";
import { Button, theme, View } from "native-base";
import { useState } from "react";
import AddHoursModal from "./AddHoursModal";

export default function AddHours() {
  const [open, setOpen] = useState(false);

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
          <Ionicons name="add" size={22} color={theme.colors.emerald[700]} />
        }
        _text={{
          color: "emerald.700",
        }}
      >
        Add Hours
      </Button>
      <AddHoursModal open={open} onClose={() => setOpen(false)} />
    </View>
  );
}
