import * as Auth from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, useEffect, useState } from "react";

const AuthContext = React.createContext<Auth.User | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Auth.User | null>(null);
  const auth = Auth.getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (state) => {
      setState(state);
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAccount = () => React.useContext(AuthContext);
