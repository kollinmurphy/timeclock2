import { DailySummary, TimesheetHours } from "@datatypes/Timesheet";
import { useTheme } from "native-base";
import { Pressable, Text } from "react-native";
import { formatDateHHMMAMPM } from "src/utils/dates";

export default function TimesheetEntry(props: {
  setEditingHours: React.Dispatch<React.SetStateAction<TimesheetHours>>;
  hours: TimesheetHours;
  index: number;
  dailyTotals: Map<number, DailySummary>;
  day: { index: number; name: string };
}) {
  const theme = useTheme();
  return (
    <Pressable
      key={props.hours.start.toString()}
      onPress={() => props.setEditingHours(props.hours)}
      style={({ pressed }) => [
        pressed ? { opacity: 0.5 } : { opacity: 1 },
        {
          borderColor: theme.colors.dark[500],
          borderBottomWidth: 0.5,
          borderTopWidth: props.index === 0 ? 1 : 0.5,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          padding: theme.space[2],
          borderTopLeftRadius: props.index === 0 ? theme.radii.xl : undefined,
          borderTopRightRadius: props.index === 0 ? theme.radii.xl : undefined,
          borderBottomLeftRadius:
            props.index ===
            props.dailyTotals.get(props.day.index)?.hours.length - 1
              ? theme.radii.xl
              : undefined,
          borderBottomRightRadius:
            props.index ===
            props.dailyTotals.get(props.day.index)?.hours.length - 1
              ? theme.radii.xl
              : undefined,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      <Text>
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
      <Text
        style={{
          color: theme.colors.dark[400],
        }}
      >
        Edit
      </Text>
    </Pressable>
  );
}
