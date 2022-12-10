import { clockIn, clockOut } from "@data/firestore";
import { Timesheet, TimesheetHours } from "@datatypes/Timesheet";
import { useAccount } from "@hooks/useAccount";
import { Button, View } from "native-base";
import { useCallback, useMemo } from "react";
import { Text } from "react-native";
import { formatDateHHMMAMPM } from "src/utils/dates";

export default function ClockInOutCard(props: { timesheet: Timesheet }) {
  const account = useAccount();

  const current = useMemo(
    () =>
      props.timesheet.hours.length > 0
        ? props.timesheet.hours.at(-1).end
          ? undefined
          : props.timesheet.hours.at(-1)
        : undefined,
    [props.timesheet.hours]
  );

  const handleClockIn = useCallback(async () => {
    try {
      const hour: TimesheetHours = {
        day: new Date().getDay(),
        start: new Date().getTime(),
      };
      clockIn(account.user.uid, hour);
    } catch (err) {
      console.error(err);
    }
  }, [account.user]);

  const handleClockOut = useCallback(async () => {
    try {
      const hour: TimesheetHours = {
        ...current,
        end: new Date().getTime(),
      };
      clockOut(account.user.uid, hour);
    } catch (err) {
      console.error(err);
    }
  }, [account.user, current]);

  return (
    <View p={4} rounded="xl" bg="light.50" shadow="2">
      <Text
        style={{
          fontSize: 16,
          paddingBottom: 8,
        }}
      >
        {current
          ? `You clocked in at ${formatDateHHMMAMPM(new Date(current.start))}.`
          : "You are currently clocked out."}
      </Text>

      {current ? (
        <Button size="lg" colorScheme="indigo" onPress={handleClockOut}>
          Clock Out
        </Button>
      ) : (
        <Button size="lg" colorScheme="emerald" onPress={handleClockIn}>
          Clock In
        </Button>
      )}
    </View>
  );
}
