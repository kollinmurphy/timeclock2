import firebaseApp from "./firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const auth = getAuth(firebaseApp);

export const createAcount = async (email: string, password: string) => {
  if (password.length < 6)
    throw new Error("Password must be at least 6 characters");
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/email-already-in-use":
          throw new Error("Email already in use");
        default:
          throw new Error("Something went wrong");
      }
    }
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/user-not-found":
          throw new Error("User not found");
        case "auth/wrong-password":
          throw new Error("Wrong password");
        default:
          throw new Error("Something went wrong");
      }
    }
  }
};

export const signOut = async () => {
  await auth.signOut();
};
