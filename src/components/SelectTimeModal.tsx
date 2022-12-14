import DatePicker from "react-native-date-picker";

export default function SelectTimeModal(props: {
  open: boolean;
  onClose: (time: number | undefined) => void;
  minimumDate?: Date;
}) {
  return (
    <DatePicker
      modal={true}
      open={props.open}
      date={new Date()}
      onConfirm={(date) => props.onClose(date.getTime())}
      onCancel={() => props.onClose(undefined)}
      maximumDate={new Date()}
      minimumDate={props.minimumDate}
      mode="time"
    />
  );
}
