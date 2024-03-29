import useIsDarkMode from "@hooks/useIsDarkMode";
import { formatDifferenceShort } from "@utils/dates";
import { MotiView } from "moti";
import { Text, useTheme, View } from "native-base";
import { useState } from "react";
import { Pressable } from "react-native";
import { DailySummary, TimesheetHours } from "../types/Timesheet";
import EditHoursModal from "./EditHoursModal";
import { CurrentShift } from "./TimesheetCard";
import TimesheetEntry from "./TimesheetEntry";

const COLLAPSED_HEIGHT = 41;
const HEIGHT_PER_ITEM = 40;
const BASELINE_EXPANDED_HEIGHT = 12;

export default function TimesheetCardRow({
  day,
  clockedIn,
  index,
  currentShift,
  dailyTotals,
  sort,
  roundedBottom,
  label,
}: {
  sort: string;
  day: { name: string; index: number };
  clockedIn: boolean;
  index: number;
  currentShift: CurrentShift | undefined;
  dailyTotals: Map<number, DailySummary>;
  roundedBottom?: boolean;
  label: string;
}) {
  const dark = useIsDarkMode();
  const [expanded, setExpanded] = useState(false);
  const [editingHours, setEditingHours] = useState<
    TimesheetHours | undefined
  >();
  const theme = useTheme();

  return (
    <MotiView
      style={{
        borderWidth: 1,
        borderColor: dark ? theme.colors.black : theme.colors.dark[700],
        borderTopLeftRadius: index === 0 ? theme.radii.xl : undefined,
        borderTopRightRadius: index === 0 ? theme.radii.xl : undefined,
        borderBottomLeftRadius: roundedBottom ? theme.radii.xl : undefined,
        borderBottomRightRadius: roundedBottom ? theme.radii.xl : undefined,
        overflow: "hidden",
      }}
      key={day.name}
      from={{
        backgroundColor: dark ? theme.colors.dark[50] : theme.colors.light[50],
        height: COLLAPSED_HEIGHT,
      }}
      animate={{
        backgroundColor: clockedIn
          ? dark
            ? theme.colors.emerald[900]
            : theme.colors.emerald[100]
          : dark
          ? theme.colors.dark[50]
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
            {label}
          </Text>
          <Text>
            {clockedIn && currentShift
              ? formatDifferenceShort(
                  (dailyTotals.get(day.index)?.sum ?? 0) + currentShift.minutes
                )
              : formatDifferenceShort(dailyTotals.get(day.index)?.sum ?? 0)}
          </Text>
        </View>
        <EditHoursModal
          hours={editingHours}
          onClose={() => setEditingHours(undefined)}
          sort={sort}
        />
        <View pt={3}>
          {dailyTotals.get(day.index)?.hours.length ? (
            dailyTotals
              .get(day.index)
              ?.hours.map((h, i) => (
                <TimesheetEntry
                  key={h.start}
                  hours={h}
                  setEditingHours={() => setEditingHours(h)}
                  type={
                    dailyTotals.get(day.index).hours.length === 1
                      ? "single"
                      : i === 0
                      ? "first"
                      : i === dailyTotals.get(day.index).hours.length - 1
                      ? "last"
                      : "middle"
                  }
                />
              ))
          ) : (
            <Text
              style={{
                paddingTop: theme.space[2],
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
