import { TimesheetHours } from "@types/Timesheet";
import { useTheme } from "native-base";
import { Pressable, Text } from "react-native";
import { formatDateHHMMAMPM, formatDateMMDD } from "@utils/dates";

export default function TimesheetEntry(props: {
  setEditingHours: React.Dispatch<React.SetStateAction<TimesheetHours>>;
  hours: TimesheetHours;
  type: "first" | "middle" | "last" | "single";
  showDate?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      key={props.hours.start.toString()}
      onPress={() => props.setEditingHours(props.hours)}
      disabled={!props.hours.end}
      style={({ pressed }) => [
        pressed ? { opacity: 0.5 } : { opacity: 1 },
        {
          borderColor: theme.colors.dark[500],
          borderBottomWidth: 0.5,
          borderTopWidth:
            props.type === "first" || props.type === "single" ? 1 : 0.5,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          padding: theme.space[2],
          borderTopLeftRadius:
            props.type === "first" || props.type === "single"
              ? theme.radii.xl
              : undefined,
          borderTopRightRadius:
            props.type === "first" || props.type === "single"
              ? theme.radii.xl
              : undefined,
          borderBottomLeftRadius:
            props.type === "last" || props.type === "single"
              ? theme.radii.xl
              : undefined,
          borderBottomRightRadius:
            props.type === "last" || props.type === "single"
              ? theme.radii.xl
              : undefined,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      <Text>
        {props.showDate && formatDateMMDD(new Date(props.hours.start)) + " - "}
        {formatDateHHMMAMPM(new Date(props.hours.start))} -{" "}
        {props.hours.end
          ? formatDateHHMMAMPM(new Date(props.hours.end))
          : "now"}
        {props.hours.edited && (
          <Text
            style={{
              color: theme.colors.light[400],
            }}
          >
            {" "}
            (edited)
          </Text>
        )}
      </Text>
      {props.hours.end && (
        <Text
          style={{
            color: theme.colors.dark[400],
          }}
        >
          Edit
        </Text>
      )}
    </Pressable>
  );
}
