import { Ionicons } from "@expo/vector-icons";
import { Button, theme, View } from "native-base";
import { useState } from "react";
import AddHoursModal from "./AddHoursModal";

export default function AddEntry(props: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <View
      style={{
        marginBottom: theme.space[2],
      }}
    >
      <Button
        colorScheme="indigo"
        variant="ghost"
        onPress={() => setOpen(true)}
        leftIcon={
          <Ionicons name="add" size={22} color={theme.colors.indigo[500]} />
        }
      >
        Add Hours
      </Button>
      <AddHoursModal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={props.onAdd}
      />
    </View>
  );
}
