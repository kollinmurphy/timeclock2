import { DailySummary } from "@datatypes/Timesheet";
import { MotiView } from "moti";
import { useTheme, View } from "native-base";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { formatDateHHMMAMPM, formatDifferenceShort } from "src/utils/dates";
import { CurrentShift } from "./TimesheetCard";

const daysOfWeek = [
  { name: "Monday", index: 1 },
  { name: "Tuesday", index: 2 },
  { name: "Wednesday", index: 3 },
  { name: "Thursday", index: 4 },
  { name: "Friday", index: 5 },
  { name: "Saturday", index: 6 },
  { name: "Sunday", index: 0 },
];

const COLLAPSED_HEIGHT = 41;
const HEIGHT_PER_ITEM = 22;
const BASELINE_EXPANDED_HEIGHT = 8;

export default function TimesheetCardRow({
  day,
  clockedIn,
  index,
  currentShift,
  dailyTotals,
}: {
  day: { name: string; index: number };
  clockedIn: boolean;
  index: number;
  currentShift: CurrentShift | undefined;
  dailyTotals: Map<number, DailySummary>;
}) {
  const [expanded, setExpanded] = useState(false);
  const currentDay = new Date().getDay();
  const theme = useTheme();

  return (
    <MotiView
      style={{
        borderWidth: 1,
        borderColor: theme.colors.dark[700],
        borderTopLeftRadius: index === 0 ? theme.radii.xl : undefined,
        borderTopRightRadius: index === 0 ? theme.radii.xl : undefined,
        overflow: "hidden",
      }}
      key={day.name}
      from={{
        backgroundColor: theme.colors.light[50],
        height: COLLAPSED_HEIGHT,
      }}
      animate={{
        backgroundColor:
          day.index === currentDay && clockedIn
            ? theme.colors.emerald[100]
            : theme.colors.light[50],
        height: expanded
          ? COLLAPSED_HEIGHT +
            HEIGHT_PER_ITEM * (dailyTotals.get(day.index)?.hours.length || 1) +
            BASELINE_EXPANDED_HEIGHT
          : COLLAPSED_HEIGHT,
      }}
      transition={{
        type: "timing",
        duration: 250,
      }}
    >
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={({ pressed }) => [
          pressed ? { opacity: 0.5 } : { opacity: 1 },
          { padding: theme.space[3] },
        ]}
      >
        <View
          flexDirection="row"
          justifyContent="space-between"
          style={{
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {day.name}
          </Text>
          <Text>
            {currentShift?.day === day.index
              ? formatDifferenceShort(
                  (dailyTotals.get(day.index)?.sum ?? 0) + currentShift.minutes
                )
              : formatDifferenceShort(dailyTotals.get(day.index)?.sum ?? 0)}
          </Text>
        </View>
        <View pt={3}>
          {dailyTotals.get(day.index)?.hours.length ? (
            dailyTotals.get(day.index)?.hours.map((h) => (
              <Text
                key={h.start.toString()}
                style={{
                  paddingVertical: 2,
                  textAlign: "right",
                }}
              >
                {formatDateHHMMAMPM(new Date(h.start))} -{" "}
                {h.end ? formatDateHHMMAMPM(new Date(h.end)) : "now"}
              </Text>
            ))
          ) : (
            <Text
              style={{
                paddingBottom: 2,
              }}
            >
              No hours!
            </Text>
          )}
        </View>
      </Pressable>
    </MotiView>
  );
}
