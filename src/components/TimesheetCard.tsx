import { formatDateMMDD, getStartAndEndFromSort } from "@utils/dates";
import { Heading, View } from "native-base";
import { Timesheet } from "../types/Timesheet";
import TimesheetTable from "./TimesheetTable";

export type CurrentShift = {
  day: number;
  minutes: number;
};
export default function TimesheetCard(props: { timesheet: Timesheet }) {
  const { start, end } = getStartAndEndFromSort(props.timesheet.sort);
  return (
    <View
      p={4}
      rounded="xl"
      _light={{
        bg: "light.50",
      }}
      _dark={{
        bg: "dark.200",
      }}
      shadow="2"
      mx={3}
    >
      <Heading size="md" textAlign="center">
        {formatDateMMDD(start)} - {formatDateMMDD(end)}
      </Heading>
      <TimesheetTable
        timesheet={props.timesheet}
        showTotal={true}
        startDate={start}
      />
    </View>
  );
}
