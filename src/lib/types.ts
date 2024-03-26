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

export type Customer = {
    id: number,
    name: string,
    phone: string,
    num_orders: number,
    total_spent: number
};

export type Employee = {
    id: number,
    name: string,
    password: string,
    is_manager: boolean
};

export type InventoryItem = {
    id: number,
    name: string,
    price: number,
    fill_level: number,
    curr_level: number,
    times_refilled: number,
    date_refilled: Date,
    has_dairy: boolean,
    has_nuts: boolean,
    has_eggs: boolean,
    is_vegan: boolean,
    is_halal: boolean
};

export type MenuItem = {
    id: number,
    name: string,
    price: number,
    times_ordered: number
;}

export type Order = {
    id: number,
    date: Date,
    time: Date,
    total: number,
    cust_id: number,
    emp_id: number
};