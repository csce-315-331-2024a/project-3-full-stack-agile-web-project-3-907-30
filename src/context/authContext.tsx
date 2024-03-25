import React, { ReactNode } from "react";
import { ironOptions } from "../lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { NextRouter } from "next/router";
import { AuthHookType } from "@/lib/types";

interface AuthProviderProps {
  children: ReactNode;
  ssrAccount: any;
}

export const AuthContext = React.createContext({});

/**
 * Get the Google account from the session
 * 
 * @param {any} req The request object
 * @returns {any | null} The Google account or null if it doesn't exist
 */
export const getGoogleAccountFromSession = withIronSessionSsr(async ({ req }: any) => {
  if (req.session.account === undefined) {
    return null;
  } else {
    const account = req.session.account;
    return account;
  }
}, ironOptions);

/**
 * The AuthProvider component
 * 
 * @param {ReactNode} children The children of the component
 * @param {any} ssrAccount The SSR account
 * @param {any} props The props of the component
 * @returns {JSX.Element} The auth context provider
 */
export function AuthProvider({ children, ssrAccount, ...props }: AuthProviderProps) {
  const [account] = React.useState(ssrAccount);

  async function login(router: NextRouter) {
    const res = await fetch("/api/auth/google");
    const data = await res.json();
    router.push(data.Location);
  }

  async function logout() {
    const res = await fetch("/api/auth/logout");
    const data = await res.json();
    if (data.status === 200) {
      window.location.href = '/';
    }
  }

  const auth: AuthHookType = {
    account,
    login,
    logout,
    ...props,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
