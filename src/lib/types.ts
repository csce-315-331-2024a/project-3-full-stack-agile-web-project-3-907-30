import { NextRouter } from "next/router";

export interface Account {
  id: string;
  email: string;
  name: string;
  picture: string;
  isEmployee: boolean;
  isManager: boolean;
  isAdmin: boolean;
  points: number;
}

export interface GoogleAccount {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export interface AuthHookType {
  login: (router: NextRouter) => Promise<void>;
  logout: () => Promise<void>;
  account: Account | null;
}


