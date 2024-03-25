import { GoogleAccount } from "./types";
import { IronSessionOptions } from "iron-session";

export const ironOptions: IronSessionOptions = {
  cookieName: "POS_SESSION_COOKIE",
  password: process.env.APPLICATION_SECRET!,
};

declare module "iron-session" {
  interface IronSessionData {
    account?: GoogleAccount;
  }
}
