import { getISOWeek } from "date-fns";
import { useEffect, useState } from "react";
import { listenToDocument, putDocument } from "../data/firestore";
import { Timesheet } from "../types/Timesheet";
import { useAccount } from "./useAccount";

export default function useTimesheet(week?: number, year?: number) {
  const account = useAccount();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);

  useEffect(() => {
    let localWeek = week ?? getISOWeek(new Date());
    let localYear = year ?? new Date().getFullYear();
    const id = account.user?.uid;
    if (!id) return;
    const docId = `${id}_${localYear}-${localWeek}`;
    const unsub = listenToDocument("timesheets", docId, id, (doc) => {
      setTimesheet(doc as Timesheet);
      if (!doc)
        putDocument("timesheets", docId, {
          userId: id,
          sort: `${localYear}-${localWeek}`,
          week: localWeek,
          year: localYear,
          hours: [],
        });
    });
    return () => unsub();
  }, [week, account.user]);

  return {
    timesheet,
    setTimesheet,
  };
}
