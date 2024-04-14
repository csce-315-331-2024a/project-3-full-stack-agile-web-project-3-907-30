import { NextRouter } from "next/router";

export interface Employee {
  empId: string;
  empName: string;
  empEmail: string;
  empPicture: string;
  isManager: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  totalOrders: number;
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
  cust_id: number;
  cust_name: string;
  phone_number: string;
  num_orders: number;
  total_spent: number;
  points: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  price: number;
  fill_level: number;
  curr_level: number;
  times_refilled: number;
  date_refilled: Date;
  has_dairy: boolean;
  has_nuts: boolean;
  has_eggs: boolean;
  is_vegan: boolean;
  is_halal: boolean;
}

export interface Allergens {
  has_dairy: boolean;
  has_nuts: boolean;
  has_eggs: boolean;
  is_vegan: boolean;
  is_halal: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  times_ordered: number;
}

export interface Order {
  id: number;
  date: Date;
  time: Date;
  total: number;
  cust_id: number;
  emp_id: number;
}

export interface PairsAndAppearance {
  row_id: number,
  item1: string;
  item2: string;
  appearances: number;
}

export interface PopularMenuItem {
  row_id: number,
  item: string;
  num_sales: number;
}

export interface SalesForADay {
  row_id: number,
  day: Date;
  sales: number;
}

export interface SalesReportItem {
  id: number;
  name: string;
  profit: number;
}

export interface ProductUsageItem {
  id: number;
  name: string;
  amount: number;
}

export interface MostProductiveEmployeeItem {
  id: number;
  name: string;
  total_orders: number;
}

export interface CustomerOrder {
  order_id: number,
  order_date: Date,
  order_time: TimeRanges,
  order_total: number,
  cust_id: number,
  emp_id: number,
  used_points: boolean
}