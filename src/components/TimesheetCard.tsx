import { getStartAndEndFromSort } from "@utils/dates";
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
    <View p={4} rounded="xl" bg="light.50" shadow="2">
      <Heading size="md" textAlign="center">
        {start} - {end}
      </Heading>
      <TimesheetTable timesheet={props.timesheet} showTotal={true} />
    </View>
  );
}
