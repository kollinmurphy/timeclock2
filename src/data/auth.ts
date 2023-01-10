import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import firebaseApp, { logAnalyticsEvent } from "./firebase";
import { batchDelete, fetchAllTimesheets } from "./firestore";

export const auth = getAuth(firebaseApp);

export const createAcount = async (email: string, password: string) => {
  if (password.length < 6)
    throw new Error("Password must be at least 6 characters");
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await logAnalyticsEvent("create_account");
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
    throw new Error("Something went wrong");
  }
};

export const linkCredential = async (email: string, password: string) => {
  if (password.length < 6)
    throw new Error("Password must be at least 6 characters");
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(auth.currentUser, credential);
    await logAnalyticsEvent("link_credential");
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
    throw new Error("Something went wrong");
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await logAnalyticsEvent("sign_in");
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
    throw new Error("Something went wrong");
  }
};

export const signOut = async () => {
  await auth.signOut();
  await logAnalyticsEvent("sign_out");
};

export const anonymousSignIn = async () => {
  await signInAnonymously(auth);
  await logAnalyticsEvent("anonymous_sign_in");
};

export const deleteAccount = async (password: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user found");
  try {
    if (user.isAnonymous) {
      await user.delete();
      return;
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    const timesheets = await fetchAllTimesheets(user.uid);
    await logAnalyticsEvent("delete_account", {
      timesheets: timesheets.length,
    });
    await batchDelete(timesheets.map((t) => t.id));
    await user.delete();
  } catch (err) {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/wrong-password":
          throw new Error("Wrong password");
        default:
          throw new Error("Something went wrong");
      }
    }
    throw new Error("Something went wrong");
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    await logAnalyticsEvent("reset_password");
  } catch (err) {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/user-not-found":
          throw new Error("User not found");
        default:
          throw new Error("Something went wrong");
      }
    }
    throw new Error("Something went wrong");
  }
};

export const changePassword = async (password: string, newPassword: string) => {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    await logAnalyticsEvent("change_password");
  } catch (err) {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/wrong-password":
          throw new Error("Wrong password");
        default:
          throw new Error("Something went wrong");
      }
    }
    throw new Error("Something went wrong");
  }
};
