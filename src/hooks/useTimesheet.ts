import { getISOWeek } from "date-fns";
import { useEffect, useState } from "react";
import { getSnapshot, putDocument } from "../data/firestore";
import { Timesheet } from "../types/Timesheet";
import { useAccount } from "./useAccount";

export default function useTimesheet(week?: number) {
  const account = useAccount();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);

  useEffect(() => {
    let localWeek = week ?? getISOWeek(new Date());
    const id = account.user?.uid;
    if (!id) return;
    const docId = `${id}_${localWeek}`;
    (async () => {
      try {
        console.log('getting doc')
        const doc: Timesheet | undefined = (await getSnapshot(
          "timesheets",
          docId,
          id
        )) as unknown as Timesheet;
        console.log('got doc')
        if (doc) return setTimesheet(doc);
        const newDoc: Timesheet = {
          week: localWeek,
          sort: `${new Date().getFullYear()}-${
            localWeek < 10 ? `0${localWeek}` : localWeek
          }`,
          userId: id,
          hours: [],
        };
        await putDocument("timesheets", docId, newDoc);
        setTimesheet(newDoc);
      } catch (err) {
        console.log('failed')
        console.error(err);
      }
    })();
  }, [week, account.user]);

  return {
    timesheet,
    setTimesheet,
  };
}
