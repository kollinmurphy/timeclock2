import {
  formatDate,
  formatDifferenceShort,
  sumHours,
  sumHoursByDay,
} from "@utils/dates";
import { add, differenceInMinutes, isToday } from "date-fns";
import { View, Text } from "native-base";
import { useEffect, useMemo, useRef, useState } from "react";
import { Timesheet } from "../types/Timesheet";
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
export default function TimesheetTable(props: {
  timesheet: Timesheet;
  showTotal: boolean;
  startDate: Date;
}) {
  const timerRef = useRef<any>();
  const [clockedIn, setClockedIn] = useState(false);

  const current = useMemo(
    () =>
      props.timesheet.hours.length > 0
        ? props.timesheet.hours[props.timesheet.hours.length - 1].end
          ? undefined
          : props.timesheet.hours[props.timesheet.hours.length - 1]
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
            day: new Date(current.start).getDay(),
            minutes: differenceInMinutes(new Date(), current.start),
          }
        : undefined
  );

  useEffect(() => {
    if (!current) return setCurrentShift(undefined);
    timerRef.current = setInterval(() => {
      const mins = differenceInMinutes(new Date(), current.start);
      setCurrentShift({
        day: new Date(current.start).getDay(),
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
    <>
      <View
        _dark={{
          borderColor: "black",
        }}
        _light={{
          borderColor: "dark.700",
        }}
        borderWidth="1"
        rounded="xl"
        my={4}
      >
        {daysOfWeek.map((day, index) => (
          <TimesheetCardDay
            key={index}
            day={day}
            label={formatDate(add(props.startDate, { days: index }))}
            dailyTotals={dailyTotals}
            currentShift={currentShift}
            clockedIn={
              clockedIn && isToday(add(props.startDate, { days: index }))
            }
            index={index}
            sort={props.timesheet.sort}
            roundedBottom={
              index === daysOfWeek.length - 1 && !props.showTotal ? true : false
            }
          />
        ))}
        {props.showTotal && (
          <View
            p={3}
            flexDirection="row"
            justifyContent="space-between"
            borderWidth="1"
            roundedBottom="xl"
            _light={{
              bg: "light.100",
              borderColor: "dark.700",
            }}
            _dark={{
              bg: "dark.100",
              borderColor: "black",
            }}
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
        )}
      </View>
    </>
  );
}
