import { logAnalyticsEvent } from "@data/firebase";
import {
  formatDateMMDD,
  formatDifferenceShort,
  getStartAndEndFromSort,
  sumHours,
} from "@utils/dates";
import { MotiView } from "moti";
import { Heading, ScrollView, theme, View } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { Timesheet, TimesheetHours } from "../types/Timesheet";
import EditHoursModal from "./EditHoursModal";
import TimesheetTable from "./TimesheetTable";

const COLLAPSED_HEIGHT = 24;
const BASELINE_EXPANDED_HEIGHT = 330;

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

  useEffect(() => {
    logAnalyticsEvent(
      expanded ? "expand_history_card" : "collapse_history_card",
      {
        userId: props.timesheet.userId,
        sort: props.timesheet.sort,
      }
    );
  }, [expanded]);

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
                ? COLLAPSED_HEIGHT + BASELINE_EXPANDED_HEIGHT
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
                {formatDateMMDD(dates.start)} - {formatDateMMDD(dates.end)}
              </Heading>
              <Heading size="md">{total}</Heading>
            </View>

            <View
              mt={3}
              style={{
                flex: 1,
              }}
            >
              <ScrollView
                style={{
                  flex: 1,
                }}
              >
                <TimesheetTable
                  timesheet={props.timesheet}
                  showTotal={false}
                  startDate={dates.start}
                />
              </ScrollView>
            </View>
          </MotiView>
        </Pressable>
      </View>
    </>
  );
}
