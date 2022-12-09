import { clockIn, clockOut } from "@data/firestore";
import { Timesheet, TimesheetHours } from "@datatypes/Timesheet";
import { useAccount } from "@hooks/useAccount";
import { Button, View } from "native-base";
import { useCallback, useMemo, useState } from "react";
import { Text } from "react-native";
import { formatDateHHMMAMPM } from "src/utils/dates";

export default function ClockInOutCard(props: {
  timesheet: Timesheet;
  setTimesheet: React.Dispatch<React.SetStateAction<Timesheet>>;
}) {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const hour: TimesheetHours = {
        day: new Date().getDay(),
        start: new Date().getTime(),
      };
      await clockIn(account.user.uid, hour);
      props.setTimesheet((t) => {
        if (!t) return undefined;
        return {
          ...t,
          hours: [...t.hours, hour],
        };
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [account.user]);

  const handleClockOut = useCallback(async () => {
    setLoading(true);
    try {
      const hour: TimesheetHours = {
        ...current,
        end: new Date().getTime(),
      };
      await clockOut(account.user.uid, hour);
      props.setTimesheet((t) => {
        if (!t) return undefined;
        return {
          ...t,
          hours: [...t.hours, hour],
        };
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
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
        <Button
          size="lg"
          disabled={loading}
          colorScheme={loading ? "gray" : 'indigo'}
          onPress={handleClockOut}
        >
          Clock Out
        </Button>
      ) : (
        <Button
          size="lg"
          disabled={loading}
          colorScheme={loading ? "gray" : 'emerald'}
          onPress={handleClockIn}
        >
          Clock In
        </Button>
      )}
    </View>
  );
}
