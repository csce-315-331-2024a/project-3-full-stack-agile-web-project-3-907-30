import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Account } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get a single account from the database.
 *
 * @param {string} email The email of the account to get.
 * @returns {Promise<Account>} The account from the database.
 */
export async function getAccountFromDatabase(email: string) {
  const res = await fetch("/api/account/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data: Account = await res.json();
  return data;
}

/**
 * Get all accounts from the database.
 *
 * @returns {Promise<Account[]>} All accounts from the database.
 */
export async function getAllAccountsFromDatabase() {
  const res = await fetch("/api/account/get-all");
  const data: Account[] = await res.json();
  return data;
}

/**
 * Get the current role of an account.
 *
 * @param {Account} account The account to get the role of.
 * @returns {string} The current role of the account.
 */
export function getRole(account: Account) {
  if (account.isAdmin) {
    return "Admin";
  } else if (account.isManager) {
    return "Manager";
  } else if (account.isEmployee) {
    return "Employee";
  } else {
    return "Customer";
  }
}
