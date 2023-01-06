import * as Auth from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useEffect, useState } from "react";

const AuthContext = React.createContext<{
  user: Auth.User | null;
  status: "loading" | "loaded";
  setAnonymous: React.Dispatch<React.SetStateAction<boolean>>;
  anonymous: boolean;
}>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Auth.User | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded">("loading");
  const auth = Auth.getAuth();
  const [anonymous, setAnonymous] = useState<boolean>(
    auth.currentUser?.isAnonymous || false
  );

  useEffect(() => {
    onAuthStateChanged(auth, (state) => {
      setStatus("loaded");
      setState(state);
      setAnonymous(state?.isAnonymous || false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state,
        status,
        setAnonymous,
        anonymous,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAccount = () => React.useContext(AuthContext);
