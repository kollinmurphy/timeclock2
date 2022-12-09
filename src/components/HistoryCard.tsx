import { Timesheet } from "@datatypes/Timesheet";
import { Heading, View } from "native-base";
import { useMemo } from "react";
import {
  formatDifferenceShort,
  getStartAndEndFromSort,
  sumHours,
} from "src/utils/dates";

export default function HistoryCard(props: { timesheet: Timesheet }) {
  const dates = useMemo(
    () => getStartAndEndFromSort(props.timesheet.sort),
    [props.timesheet.sort]
  );

  const total = useMemo(
    () => formatDifferenceShort(sumHours(props.timesheet.hours)),
    [props.timesheet.hours]
  );

  return (
    <View
      p={4}
      rounded="xl"
      bg="light.50"
      shadow="1"
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Heading size="md">
        {dates.start} - {dates.end}
      </Heading>
      <Heading size="md">{total}</Heading>
    </View>
  );
}
