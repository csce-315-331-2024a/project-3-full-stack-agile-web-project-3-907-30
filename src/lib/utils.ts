import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Customer, Employee } from "./types";
import { Pool, DataTypeOIDs, QueryResult } from "postgresql-client";
import { InventoryItem, MenuItem } from "@/lib/types";
import db from "./db";

// export async function getMenuItem(id: number) : Promise<MenuItem> {
//     const sql = "SELECT item_id, item_name, item_price::numeric, times_ordered FROM menu_items WHERE item_id = ($1)";

//     const res = await executeStatement(db, sql, [DataTypeOIDs.int8], [id]).then(result => {
//         return rowToMenuItem(result.rows?.at(0));
//     });
//     return res;
// }

// export async function getAllMenuItems() : Promise<MenuItem[]> {
//     const sql = "SELECT item_id, item_name, item_price::numeric, times_ordered FROM menu_items;";
//     const res = await executeStatement(db, sql, [], []).then(result => {
//         const results = result.rows?.map(row => {
//             return rowToMenuItem(row);
//         }) as MenuItem[];
//         return Promise.all(results);
//     });
//     return res;
// }

// export async function getItemIngredients(id: number) : Promise<InventoryItem[]> {
//     const sql = `SELECT inv_menu.inv_id, inv_name, inv_price::numeric, fill_level, current_level, times_refilled, date_refilled, has_dairy, has_nuts, has_eggs, is_vegan, is_halal
//     FROM inv_menu
//     INNER JOIN inventory AT inventory.inv_id = inv_menu.inv_id
//     WHERE inv_menu.menu_id = $1`;
//     const types = [
//         DataTypeOIDs.int4,
//         DataTypeOIDs.varchar,
//         DataTypeOIDs.numeric,
//         DataTypeOIDs.int4,
//         DataTypeOIDs.int4,
//         DataTypeOIDs.int4,
//         DataTypeOIDs.date,
//         DataTypeOIDs.bool,
//         DataTypeOIDs.bool,
//         DataTypeOIDs.bool,
//         DataTypeOIDs.bool,
//         DataTypeOIDs.bool
//     ];

//     const res = await executeStatement(db, sql, types, [id]).then((result) => {
//         const results = result.rows?.map(row => {
//             return rowToInventoryItem(row);
//         }) as InventoryItem[];
//         return Promise.all(results);
//     });
//     return res;
// }

export function isLowStock(curr: number, reqd: number): boolean {
  return curr < reqd;
}

export function rowToMenuItem(array: any[]): MenuItem {
  return {
    id: array.at(0),
    name: array.at(1),
    price: array.at(2),
    times_ordered: array.at(3),
  } as MenuItem;
}

export function rowToInventoryItem(array: any[]): InventoryItem {
  return {
    id: array.at(0),
    name: array.at(1),
    price: array.at(2),
    fill_level: array.at(3),
    curr_level: array.at(4),
    times_refilled: array.at(5),
    date_refilled: array.at(6),
    has_dairy: array.at(7),
    has_nuts: array.at(8),
    has_eggs: array.at(9),
    is_vegan: array.at(10),
    is_halal: array.at(11),
  };
}

// Prepare and execute statement in one function, use callback to parse values
export async function executeStatement(
  db: Pool,
  sql: string,
  paramTypes: number[],
  params: any[]
): Promise<QueryResult> {
  const statement = await db.prepare(sql, { paramTypes: paramTypes });
  const res = await statement.execute({ params: params });
  await statement.close();
  return res;
}
import { ListOrderedIcon } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get a single employee from the database.
 *
 * @param {string} email The email of the employee to get.
 * @returns {Promise<Employee>} The employee from the database.
 */
export async function getEmployeeFromDatabase(email: string) {
  const res = await fetch("/api/employee/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data: Employee = await res.json();
  return data;
}

/**
 * Get all employees from the database.
 *
 * @returns {Promise<Employee[]>} All employees from the database.
 */
export async function getAllEmployeesFromDatabase() {
  const res = await fetch("/api/employee/get-all");
  const data: Employee[] = await res.json();
  return data;
}

/**
 * Get the current role of an employee.
 *
 * @param {Employee} employee The employee to get the role of.
 * @returns {string} The current role of the employee.
 */
export function getRole(employee: Employee) {
  if (employee.isAdmin) {
    return "Admin";
  } else if (employee.isManager) {
    return "Manager";
  } else {
    return "Employee";
  }
}

/**
 * Get a customer from the database by phone number.
 *
 * @param {string} phone The phone number of the customer.
 * @returns {Customer} The customer from the database.
 */
export async function getCustomerFromDatabase(phone: string) {
  const res = await fetch("/api/customer/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  if (res.status === 404) {
    return null;
  } else {
    const data: Customer = await res.json();
    return data;
  }
}

/**
 * Submit an order.
 *
 * @param {orderId}  The ID of the new order
 * @param {orderTotal}  The order total
 * @param {custId}  The ID of the customer making the order
 * @param {empId}  The ID of the employee creating the order
 * @returns {string} The current role of the employee.
 */
export async function submitOrder(orderId: number, orderTotal: number, custId: number, empId: number) {
  //orderId = 1000001;
  const res = await fetch("/api/employee/submit-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId, orderTotal, custId, empId }),
  });
  return res;
}

/**
 * Get the next available order ID.
 *
 * @returns {number} The next available order ID in the orders table.
 */
export async function getNextOrderId() {
  const res = await fetch("/api/order/get-next-order-id");
  const returnedData = await res.json();
  const nextOrderId = parseInt(returnedData.nextOrderId, 10);
  return nextOrderId;
}