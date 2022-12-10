import { TimesheetHours } from "@datatypes/Timesheet";
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
