import { GoogleAccount } from "./types";
import { IronSessionOptions } from "iron-session";

export const ironOptions: IronSessionOptions = {
  cookieName: "POS_SESSION_COOKIE",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
  password: process.env.APPLICATION_SECRET!,
};

declare module "iron-session" {
  interface IronSessionData {
    account?: GoogleAccount;
  }
}
