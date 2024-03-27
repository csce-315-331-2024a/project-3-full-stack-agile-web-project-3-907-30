import { NextRouter } from "next/router";

export interface Employee {
  empId: string;
  empName: string;
  empEmail: string;
  empPicture: string;
  isManager: boolean;
  isAdmin: boolean;
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
  account: GoogleAccount | null;
}

export interface Customer {
    id: number,
    name: string,
    phone: string,
    num_orders: number,
    total_spent: number
};

export interface InventoryItem {
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

export interface MenuItem {
    id: number,
    name: string,
    price: number,
    times_ordered: number
;}

export interface Order {
    id: number,
    date: Date,
    time: Date,
    total: number,
    cust_id: number,
    emp_id: number
};
