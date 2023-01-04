import { deleteHours, updateHours } from "@data/firestore";
import { useAccount } from "@hooks/useAccount";
import { formatDateHHMMAMPM, formatDateMMDD } from "@utils/dates";
import { Button, Modal, View } from "native-base";
import { useCallback, useMemo, useState } from "react";
import { Text } from "react-native";
import DatePicker from "react-native-date-picker";
import { TimesheetHours } from "../types/Timesheet";
import ErrorAlert from "./ErrorAlert";

export default function EditHoursModal(props: {
  sort: string;
  hours: TimesheetHours | null;
  onClose: () => void;
}) {
  const account = useAccount();
  const [tmpStart, setTmpStart] = useState<Date | undefined>(undefined);
  const [tmpEnd, setTmpEnd] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const startDate = useMemo(
    () =>
      tmpStart ||
      (props.hours?.start ? new Date(props.hours.start) : new Date()),
    [props.hours, tmpStart]
  );

  const endDate = useMemo(
    () => tmpEnd || (props.hours?.end ? new Date(props.hours.end) : new Date()),
    [props.hours, tmpEnd]
  );

  const handleClose = useCallback(() => {
    setTmpStart(undefined);
    setTmpEnd(undefined);
    props.onClose();
  }, [props.onClose]);

  const handleDelete = useCallback(async () => {
    try {
      setLoading(true);
      await deleteHours(account.user.uid, props.sort, props.hours);
      props.onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [props.onClose, account.user]);

  const handleSave = useCallback(async () => {
    if (startDate.getTime() > endDate.getTime()) {
      setError("Start date must be before end date");
      return;
    }
    setError(undefined);
    try {
      setLoading(true);
      await updateHours(account.user.uid, props.sort, props.hours, {
        start: startDate.getTime(),
        end: endDate.getTime(),
      });
      setError(undefined);
      props.onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [startDate, endDate, props.onClose, account.user]);

  const spansMultipleDays = useMemo(
    () => startDate.getDate() !== endDate.getDate(),
    [startDate, endDate]
  );

  return (
    <Modal isOpen={Boolean(props.hours)} onClose={handleClose} size="lg">
      <Modal.Content>
        <Modal.Header>Edit Hours</Modal.Header>
        <Modal.Body>
          {props.hours &&
            (spansMultipleDays ? (
              <>
                <Text>
                  This timesheet entry spans across multiple days. If this is
                  incorrect, please delete this entry and create a new one.
                </Text>
                <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                  Start: {formatDateHHMMAMPM(startDate)},{" "}
                  {formatDateMMDD(startDate)}
                </Text>
                <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                  End: {formatDateHHMMAMPM(endDate)}, {formatDateMMDD(endDate)}
                </Text>
              </>
            ) : (
              <>
                <DatePicker
                  modal={true}
                  open={startOpen}
                  date={startDate}
                  onConfirm={(date) => {
                    setStartOpen(false);
                    setTmpStart(date);
                  }}
                  onCancel={() => {
                    setStartOpen(false);
                  }}
                  mode="time"
                />
                <DatePicker
                  modal={true}
                  open={endOpen}
                  date={endDate}
                  onConfirm={(date) => {
                    setEndOpen(false);
                    setTmpEnd(date);
                  }}
                  onCancel={() => {
                    setEndOpen(false);
                  }}
                  mode="time"
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="lg"
                    colorScheme="indigo"
                    onPress={() => setStartOpen(true)}
                  >
                    {formatDateHHMMAMPM(startDate)}
                  </Button>
                  <Text
                    style={{
                      fontSize: 28,
                    }}
                  >
                    —
                  </Text>
                  <Button
                    size="lg"
                    colorScheme="indigo"
                    onPress={() => setEndOpen(true)}
                  >
                    {formatDateHHMMAMPM(endDate)}
                  </Button>
                </View>
              </>
            ))}
          <ErrorAlert error={error} />
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme={loading ? "gray" : "red"}
              disabled={loading}
              onPress={handleDelete}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={handleClose}
            >
              Cancel
            </Button>
            {spansMultipleDays ? null : (
              <Button
                onPress={handleSave}
                disabled={loading}
                colorScheme={loading ? "gray" : undefined}
              >
                Save
              </Button>
            )}
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
