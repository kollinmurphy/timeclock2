import {
  formatDifferenceShort,
  getStartAndEndFromSort,
  sumHours,
} from "@utils/dates";
import { MotiView } from "moti";
import { Heading, theme, View } from "native-base";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, Text } from "react-native";
import { Timesheet, TimesheetHours } from "../types/Timesheet";
import EditHoursModal from "./EditHoursModal";
import TimesheetEntry from "./TimesheetEntry";

const COLLAPSED_HEIGHT = 24;
const HEIGHT_PER_ITEM = Platform.OS === "ios" ? 35 : 37;
const BASELINE_EXPANDED_HEIGHT = 16;

export default function HistoryCard(props: { timesheet: Timesheet }) {
  const [editingHours, setEditingHours] = useState<
    TimesheetHours | undefined
  >();
  const [expanded, setExpanded] = useState(false);
  const dates = useMemo(
    () => getStartAndEndFromSort(props.timesheet.sort),
    [props.timesheet.sort]
  );

  const total = useMemo(
    () => formatDifferenceShort(sumHours(props.timesheet.hours)),
    [props.timesheet.hours]
  );

  return (
    <>
      <EditHoursModal
        hours={editingHours}
        sort={props.timesheet.sort}
        onClose={() => setEditingHours(undefined)}
      />
      <View
        rounded="xl"
        shadow="1"
        style={{
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <Pressable
          style={({ pressed }) => [pressed ? { opacity: 0.4 } : { opacity: 1 }]}
          onPress={() => setExpanded(!expanded)}
        >
          <MotiView
            style={{
              overflow: "hidden",
              margin: theme.space[4],
            }}
            from={{
              height: COLLAPSED_HEIGHT,
            }}
            animate={{
              height: expanded
                ? COLLAPSED_HEIGHT +
                  (props.timesheet.hours.length || 1) * HEIGHT_PER_ITEM +
                  BASELINE_EXPANDED_HEIGHT
                : COLLAPSED_HEIGHT,
            }}
            transition={{
              type: "timing",
              duration: 250,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Heading size="md">
                {dates.start} - {dates.end}
              </Heading>
              <Heading size="md">{total}</Heading>
            </View>

            <View mt={3}>
              {props.timesheet.hours.length === 0 ? (
                <Text
                  style={{
                    paddingTop: theme.space[1],
                    fontSize: theme.fontSizes.md,
                  }}
                >
                  No hours!
                </Text>
              ) : (
                props.timesheet.hours.map((hour, i) => (
                  <TimesheetEntry
                    key={hour.start}
                    hours={hour}
                    setEditingHours={setEditingHours}
                    showDate={true}
                    type={
                      props.timesheet.hours.length === 1
                        ? "single"
                        : i === 0
                        ? "first"
                        : i === props.timesheet.hours.length - 1
                        ? "last"
                        : "middle"
                    }
                  />
                ))
              )}
            </View>
          </MotiView>
        </Pressable>
      </View>
    </>
  );
}
