import { TimesheetHours } from "@datatypes/Timesheet";
import { getISOWeek } from "date-fns";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
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

export const getSnapshot = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return undefined;
  return {
    ...docSnap.data(),
    id: docSnap.id,
  };
};

export const clockIn = async (userId: string, hour: TimesheetHours) => {
  const weekId = getISOWeek(new Date());
  const docId = `${userId}-${weekId}`;
  const docRef = doc(db, "timesheets", docId);
  await updateDoc(docRef, {
    hours: arrayUnion(hour),
  });
};

export const clockOut = async (userId: string, hour: TimesheetHours) => {
  const weekId = getISOWeek(new Date());
  const docId = `${userId}-${weekId}`;
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
