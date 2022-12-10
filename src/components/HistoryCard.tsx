import { Timesheet } from "@datatypes/Timesheet";
import { MotiView } from "moti";
import { Heading, useTheme, View } from "native-base";
import { useMemo, useState } from "react";
import { Pressable } from "react-native";
import {
  formatDate,
  formatDateHHMMAMPM,
  formatDateMMDD,
  formatDifferenceShort,
  getStartAndEndFromSort,
  sumHours,
} from "src/utils/dates";

const COLLAPSED_HEIGHT = 24;
const HEIGHT_PER_ITEM = 28;
const BASELINE_EXPANDED_HEIGHT = 8;

export default function HistoryCard(props: { timesheet: Timesheet }) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const dates = useMemo(
    () => getStartAndEndFromSort(props.timesheet.sort),
    [props.timesheet.sort]
  );

  const total = useMemo(
    () => formatDifferenceShort(sumHours(props.timesheet.hours)),
    [props.timesheet.hours]
  );

  return (
    <Pressable
      style={({ pressed }) => [pressed ? { opacity: 0.5 } : { opacity: 1 }]}
      onPress={() => setExpanded(!expanded)}
    >
      <View
        p={4}
        rounded="xl"
        bg="light.50"
        shadow="1"
        style={{
          width: "100%",
        }}
      >
        <MotiView
          style={{
            overflow: "hidden",
          }}
          from={{
            height: COLLAPSED_HEIGHT,
          }}
          animate={{
            height: expanded
              ? COLLAPSED_HEIGHT +
                props.timesheet.hours.length * HEIGHT_PER_ITEM +
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
            {props.timesheet.hours.map((hour) => (
              <View key={hour.start} py={1}>
                <Heading size="sm">
                  {formatDate(new Date(hour.start))}  -{"  "}
                  {formatDateHHMMAMPM(new Date(hour.start))} -{" "}
                  {hour.end ? formatDateHHMMAMPM(new Date(hour.end)) : 'now'}
                </Heading>
              </View>
            ))}
          </View>
        </MotiView>
      </View>
    </Pressable>
  );
}
