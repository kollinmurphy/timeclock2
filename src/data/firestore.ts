import { Timesheet, TimesheetHours } from "@datatypes/Timesheet";
import { getISOWeek } from "date-fns";
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
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import firebaseApp from "./firebase";

const db = getFirestore(firebaseApp);

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
  const weekId = getISOWeek(new Date());
  const year = new Date().getFullYear();
  const docId = `${userId}_${year}-${weekId}`;
  const docRef = doc(db, "timesheets", docId);
  await updateDoc(docRef, {
    hours: arrayUnion(hour),
  });
};

export const clockOut = async (userId: string, hour: TimesheetHours) => {
  const weekId = getISOWeek(new Date());
  const year = new Date().getFullYear();
  const docId = `${userId}_${year}-${weekId}`;
  const docRef = doc(db, "timesheets", docId);
  const oldHour = { ...hour };
  delete oldHour.end;
  await updateDoc(docRef, {
    hours: arrayRemove(oldHour),
  });
  await updateDoc(docRef, {
    hours: arrayUnion(hour),
  });
};

export const updateHours = async (
  userId: string,
  sort: string,
  oldHour: TimesheetHours,
  newHour: TimesheetHours
) => {
  const docId = `${userId}_${sort}`;
  const docRef = doc(db, "timesheets", docId);
  await updateDoc(docRef, {
    hours: arrayRemove(oldHour),
  });
  await updateDoc(docRef, {
    hours: arrayUnion({
      ...newHour,
      edited: true,
    }),
  });
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
  console.log('adding hours')
  const snap = await getSnapshot("timesheets", docId, userId) as unknown as Timesheet;
  console.log('snap', snap)
  if (!snap) {
    console.log('creating')
    const [year, week] = sort.split("-");
    await putDocument("timesheets", docId, {
      userId,
      sort,
      year,
      week,
      hours: [hour],
    });
  } else {
    if (snap.hours.find((h) => h.start === hour.start)) throw new Error("You already have a shift with this start time");
    console.log('updating')
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
