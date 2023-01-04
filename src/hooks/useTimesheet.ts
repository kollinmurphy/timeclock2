import { formatSort } from "@utils/dates";
import { startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import { listenToDocument, putDocument } from "../data/firestore";
import { Timesheet } from "../types/Timesheet";
import { useAccount } from "./useAccount";

export default function useTimesheet() {
  const account = useAccount();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);

  useEffect(() => {
    const sort = formatSort(startOfWeek(new Date()));
    const id = account.user?.uid;
    if (!id) return;
    const docId = `${id}_${sort}`;
    const unsub = listenToDocument("timesheets", docId, id, (doc) => {
      setTimesheet(doc as Timesheet);
      if (!doc)
        putDocument("timesheets", docId, {
          userId: id,
          sort,
          hours: [],
        });
    });
    return () => unsub();
  }, [account.user]);

  return {
    timesheet,
    setTimesheet,
  };
}
