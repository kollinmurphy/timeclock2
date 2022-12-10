import { Timesheet } from "@datatypes/Timesheet";
import { differenceInMinutes } from "date-fns";
import { Heading, View } from "native-base";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text } from "react-native";
import {
  formatDifferenceShort,
  getStartAndEndFromSort,
  sumHours,
  sumHoursByDay,
} from "src/utils/dates";
import TimesheetCardDay from "./TimesheetCardDay";

const daysOfWeek = [
  { name: "Monday", index: 1 },
  { name: "Tuesday", index: 2 },
  { name: "Wednesday", index: 3 },
  { name: "Thursday", index: 4 },
  { name: "Friday", index: 5 },
  { name: "Saturday", index: 6 },
  { name: "Sunday", index: 0 },
];

export type CurrentShift = {
  day: number;
  minutes: number;
};
export default function TimesheetCard(props: {
  timesheet: Timesheet;
  setTimesheet: Dispatch<SetStateAction<Timesheet>>;
}) {
  const { start, end } = getStartAndEndFromSort(props.timesheet.sort);
  const timerRef = useRef<any>();
  const [clockedIn, setClockedIn] = useState(false);

  const current = useMemo(
    () =>
      props.timesheet.hours.length > 0
        ? props.timesheet.hours.at(-1).end
          ? undefined
          : props.timesheet.hours.at(-1)
        : undefined,
    [props.timesheet.hours]
  );
  useEffect(() => {
    if (!current) {
      setCurrentShift(undefined);
      setClockedIn(false);
      return;
    }
    setClockedIn(true);
  }, [current]);

  const [currentShift, setCurrentShift] = useState<CurrentShift | undefined>(
    () =>
      current?.start
        ? {
            day: current.day,
            minutes: differenceInMinutes(new Date(), current.start),
          }
        : undefined
  );

  useEffect(() => {
    if (!current) return setCurrentShift(undefined);
    timerRef.current = setInterval(() => {
      const mins = differenceInMinutes(new Date(), current.start);
      setCurrentShift({
        day: current.day,
        minutes: mins,
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const minutesWorked = useMemo(
    () => sumHours(props.timesheet.hours) + (currentShift?.minutes ?? 0),
    [props.timesheet.hours, currentShift]
  );

  const dailyTotals = useMemo(
    () => sumHoursByDay(props.timesheet.hours),
    [props.timesheet.hours]
  );

  return (
    <View p={4} rounded="xl" bg="light.50" shadow="2">
      <Heading size="md" textAlign="center">
        {start} - {end}
      </Heading>
      <View borderColor="dark.700" borderWidth="1" rounded="xl" my={4}>
        {daysOfWeek.map((day, index) => (
          <TimesheetCardDay
            key={index}
            day={day}
            dailyTotals={dailyTotals}
            currentShift={currentShift}
            clockedIn={clockedIn}
            index={index}
            sort={props.timesheet.sort}
            setTimesheet={props.setTimesheet}
          />
        ))}
        <View
          p={3}
          flexDirection="row"
          justifyContent="space-between"
          borderWidth="1"
          borderColor="dark.700"
          roundedBottom="xl"
          bg="light.100"
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Total
          </Text>
          <Text
            style={{
              fontSize: 18,
            }}
          >
            {formatDifferenceShort(minutesWorked)}
          </Text>
        </View>
      </View>
    </View>
  );
}
