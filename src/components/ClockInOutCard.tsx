import { clockIn, clockOut } from "@data/firestore";
import { useAccount } from "@hooks/useAccount";
import { formatDateHHMMAMPM } from "@utils/dates";
import { Button, Text, View } from "native-base";
import { useCallback, useMemo, useState } from "react";
// import { Text } from "react-native";
import { Timesheet, TimesheetHours } from "../types/Timesheet";
import SelectTimeModal from "./SelectTimeModal";
import Show from "./Show";

export default function ClockInOutCard(props: { timesheet: Timesheet }) {
  const account = useAccount();
  const [showClockInModal, setShowClockInModal] = useState(false);
  const [showClockOutModal, setShowClockOutModal] = useState(false);

  const current = useMemo(
    () =>
      props.timesheet.hours.length > 0
        ? props.timesheet.hours[props.timesheet.hours.length - 1].end
          ? undefined
          : props.timesheet.hours[props.timesheet.hours.length - 1]
        : undefined,
    [props.timesheet.hours]
  );

  const handleClockIn = useCallback(async () => {
    setShowClockInModal(false);
    try {
      const hour: TimesheetHours = {
        start: new Date().getTime(),
      };
      clockIn(account.user.uid, hour);
    } catch (err) {
      console.error(err);
    }
  }, [account.user]);

  const handleClockOut = useCallback(async () => {
    setShowClockOutModal(false);
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

  const handleClockInModal = useCallback(
    (date: number | undefined) => {
      setShowClockInModal(false);
      if (!date) return;
      try {
        const hour: TimesheetHours = {
          start: date,
          edited: true,
        };
        clockIn(account.user.uid, hour);
      } catch (err) {
        console.error(err);
      }
    },
    [account.user]
  );

  const handleClockOutModal = useCallback(
    (date: number | undefined) => {
      setShowClockOutModal(false);
      if (!date) return;
      try {
        const hour: TimesheetHours = {
          ...current,
          end: date,
          edited: true,
        };
        clockOut(account.user.uid, hour);
      } catch (err) {
        console.error(err);
      }
    },
    [account.user, current]
  );

  return (
    <View m={3} mb={0} p={4} rounded="xl" bg="light.50" shadow="2">
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
      <Show
        when={current}
        fallback={
          <Button
            size="lg"
            colorScheme="emerald"
            onPress={handleClockIn}
            onLongPress={() => setShowClockInModal(true)}
          >
            Clock In
          </Button>
        }
      >
        <Button
          size="lg"
          colorScheme="indigo"
          onPress={handleClockOut}
          onLongPress={() => setShowClockOutModal(true)}
        >
          Clock Out
        </Button>
      </Show>
      <SelectTimeModal open={showClockInModal} onClose={handleClockInModal} />
      <SelectTimeModal
        open={showClockOutModal}
        onClose={handleClockOutModal}
        minimumDate={current?.start ? new Date(current.start) : undefined}
      />
    </View>
  );
}
