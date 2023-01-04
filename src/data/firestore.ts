import { formatSort } from "@utils/dates";
import { startOfWeek } from "date-fns";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  documentId,
  DocumentSnapshot,
  getDocs,
  getFirestore,
  initializeFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { Timesheet, TimesheetHours } from "../types/Timesheet";
import firebaseApp from "./firebase";

initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
});
const db = getFirestore();

export const createDocument = async (collectionName: string, data: any) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

export const putDocument = async (
  collectionName: string,
  id: string,
  data: any
) => {
  await setDoc(doc(db, collectionName, id), data);
};

export const updateDocument = async (
  collectionName: string,
  id: string,
  data: any
) => {
  await updateDoc(doc(db, collectionName, id), data);
};

export const listenToDocument = (
  collectionName: string,
  id: string,
  userId: string,
  callback: (data: any) => void
) => {
  const q = query(
    collection(db, collectionName),
    where(documentId(), "==", id),
    where("userId", "==", userId),
    limit(1)
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) return callback(undefined);
    return callback({
      ...snapshot.docs[0].data(),
      id: snapshot.docs[0].id,
    });
  });
  return unsubscribe;
};

export const getSnapshot = async (
  collectionName: string,
  id: string,
  userId: string
) => {
  const q = query(
    collection(db, collectionName),
    where(documentId(), "==", id),
    where("userId", "==", userId),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return undefined;
  return {
    ...querySnapshot.docs[0].data(),
    id: querySnapshot.docs[0].id,
  };
};

export const clockIn = async (userId: string, hour: TimesheetHours) => {
  const sort = formatSort(startOfWeek(new Date()));
  const docId = `${userId}_${sort}`;
  const docRef = doc(db, "timesheets", docId);
  await updateDoc(docRef, {
    hours: arrayUnion(hour),
  });
};

export const clockOut = async (userId: string, hour: TimesheetHours) => {
  const sort = formatSort(startOfWeek(new Date()));
  const docId = `${userId}_${sort}`;
  const docRef = doc(db, "timesheets", docId);
  const oldHour = { ...hour };
  delete oldHour.end;

  const batch = writeBatch(db);
  batch.update(docRef, {
    hours: arrayRemove(oldHour),
  });
  batch.update(docRef, {
    hours: arrayUnion(hour),
  });
  await batch.commit();
};

export const updateHours = async (
  userId: string,
  sort: string,
  oldHour: TimesheetHours,
  newHour: TimesheetHours
) => {
  const docId = `${userId}_${sort}`;
  const docRef = doc(db, "timesheets", docId);

  const batch = writeBatch(db);
  batch.update(docRef, {
    hours: arrayRemove(oldHour),
  });
  batch.update(docRef, {
    hours: arrayUnion({
      ...newHour,
      edited: true,
    }),
  });
  await batch.commit();
};

export const deleteHours = async (
  userId: string,
  sort: string,
  hour: TimesheetHours
) => {
  const docId = `${userId}_${sort}`;
  const docRef = doc(db, "timesheets", docId);
  await updateDoc(docRef, {
    hours: arrayRemove(hour),
  });
};

export const addHours = async (
  userId: string,
  sort: string,
  hour: TimesheetHours
) => {
  const docId = `${userId}_${sort}`;
  const docRef = doc(db, "timesheets", docId);
  const snap = (await getSnapshot(
    "timesheets",
    docId,
    userId
  )) as unknown as Timesheet;
  if (!snap) {
    const [year, month, day] = sort.split("-");
    await putDocument("timesheets", docId, {
      userId,
      sort,
      year,
      month,
      day,
      hours: [hour],
    });
  } else {
    if (snap.hours.find((h) => h.start === hour.start))
      throw new Error("You already have a shift with this start time");
    await updateDoc(docRef, {
      hours: arrayUnion(hour),
    });
  }
};

export const queryTimesheets = async (
  userId: string,
  previousRef?: DocumentSnapshot
) => {
  const q = query(
    collection(db, "timesheets"),
    where("userId", "==", userId),
    orderBy("sort", "desc"),
    limit(10),
    ...(previousRef ? [startAfter(previousRef)] : [])
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    snapshot: doc,
  }));
};

export const queryTimesheetsLive = (
  userId: string,
  callback: (data: Array<Timesheet & { snapshot: DocumentSnapshot }>) => void,
  previousRef?: DocumentSnapshot
) => {
  const q = query(
    collection(db, "timesheets"),
    where("userId", "==", userId),
    orderBy("sort", "desc"),
    limit(10),
    ...(previousRef ? [startAfter(previousRef)] : [])
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    return callback(
      snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Timesheet, "id">),
        id: doc.id,
        snapshot: doc,
      }))
    );
  });
  return unsubscribe;
};
