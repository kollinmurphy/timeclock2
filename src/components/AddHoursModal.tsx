import { addHours } from "@data/firestore";
import { useAccount } from "@hooks/useAccount";
import { add, getISOWeek, startOfDay } from "date-fns";
import { Button, Modal, theme, View } from "native-base";
import { useCallback, useState } from "react";
import { Text } from "react-native";
import DatePicker from "react-native-date-picker";
import { formatDateEMMDDYYYY, formatDateHHMMAMPM } from "src/utils/dates";
import ErrorAlert from "./ErrorAlert";

export default function AddHoursModal(props: {
  onClose: () => void;
  open: boolean;
  onAdd: () => void;
}) {
  const account = useAccount();
  const [day, setDay] = useState<Date>(new Date());
  const [start, setStart] = useState<Date>(() =>
    add(startOfDay(new Date()), { hours: 9 })
  );
  const [end, setEnd] = useState<Date>(() =>
    add(startOfDay(new Date()), { hours: 10 })
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [dayOpen, setDayOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handleClose = useCallback(() => {
    props.onClose();
  }, [props.onClose]);

  const handleSave = useCallback(async () => {
    if (start.getTime() > end.getTime()) {
      setError("Start date must be before end date");
      return;
    }
    setError(undefined);
    try {
      setLoading(true);
      const sort = `${day.getFullYear()}-${getISOWeek(day)}`;
      await addHours(account.user.uid, sort, {
        day: day.getDay(),
        start: start.getTime(),
        end: end.getTime(),
      });
      setError(undefined);
      props.onAdd();
      props.onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [props.onClose, account.user, day, start, end, props.onAdd]);

  return (
    <Modal isOpen={props.open} onClose={handleClose} size="lg">
      <Modal.Content>
        <Modal.Header>Add Hours</Modal.Header>
        <Modal.Body>
          <DatePicker
            modal={true}
            open={startOpen}
            date={start}
            onConfirm={(date) => {
              setStartOpen(false);
              setStart(date);
            }}
            onCancel={() => {
              setStartOpen(false);
            }}
            mode="time"
          />
          <DatePicker
            modal={true}
            open={endOpen}
            date={end}
            onConfirm={(date) => {
              setEndOpen(false);
              setEnd(date);
            }}
            onCancel={() => {
              setEndOpen(false);
            }}
            mode="time"
          />
          <DatePicker
            modal={true}
            open={dayOpen}
            date={day}
            onConfirm={(date) => {
              setDayOpen(false);
              setDay(date);
              const newStart = new Date(start);
              newStart.setDate(date.getDate());
              newStart.setMonth(date.getMonth());
              newStart.setFullYear(date.getFullYear());
              setStart(newStart);
              const newEnd = new Date(end);
              newEnd.setDate(date.getDate());
              newEnd.setMonth(date.getMonth());
              newEnd.setFullYear(date.getFullYear());
              setEnd(newEnd);
            }}
            onCancel={() => {
              setDayOpen(false);
            }}
            maximumDate={new Date()}
            mode="date"
          />
          <Button
            onPress={() => setDayOpen(true)}
            size="lg"
            colorScheme="indigo"
            variant="outline"
            style={{
              marginHorizontal: theme.space[2],
              marginBottom: theme.space[3],
            }}
          >
            {formatDateEMMDDYYYY(day)}
          </Button>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: theme.space[2],
            }}
          >
            <Button
              size="lg"
              colorScheme="indigo"
              variant="outline"
              onPress={() => setStartOpen(true)}
            >
              {formatDateHHMMAMPM(start)}
            </Button>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              to
            </Text>
            <Button
              size="lg"
              colorScheme="indigo"
              onPress={() => setEndOpen(true)}
              variant="outline"
            >
              {formatDateHHMMAMPM(end)}
            </Button>
          </View>
          <ErrorAlert error={error} />
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={handleClose}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSave}
              disabled={loading}
              colorScheme={loading ? "gray" : undefined}
            >
              Add
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
