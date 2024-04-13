import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Allergens, Customer, Employee, PairsAndAppearance, PopularMenuItem, ProductUsageItem, SalesForADay, SalesReportItem } from "./types";
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

/**
 * Convert a given array row from a SQL execution result to an InventoryItem object.
 *
 * @param {any[]} array The given row array to be converted.
 * @returns {MenuItem} The menu item from the given row.
 */
export function rowToMenuItem(array: any[]): MenuItem {
  return {
    id: array.at(0),
    name: array.at(1),
    price: array.at(2),
    times_ordered: array.at(3),
  } as MenuItem;
}

/**
 * Convert a given array row from a SQL execution result to an InventoryItem object.
 *
 * @param {any[]} array The given row array to be converted.
 * @returns {InventoryItem} The inventory item from the given row.
 */
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

export function rowToAllergens(array: any[]): Allergens {
  return {
    has_dairy: array.at(0),
    has_nuts: array.at(1),
    has_eggs: array.at(2),
    is_vegan: array.at(3),
    is_halal: array.at(4),
  };
}

/**
 * Prepare and execute a SQL statement.
 *
 * @param {Pool} db The database pool
 * @param {string} sql The SQL statement to be executed
 * @param {number[]} paramTypes The types of the parameters, if any.
 * @param {any[]} params The parameters for the statement to be executed.
 * @returns {Promise<QueryResult>} The result of the executed SQL statement.
 */
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
 * Get all employees, including managers and admins from the database.
 *
 * @returns {Promise<Employee[]>} All employees from the database.
 */
export async function getAllEmployeesFromDatabase() {
  const res = await fetch("/api/employee/get-all");
  const data: Employee[] = await res.json();
  return data;
}

/**
 * Get verified employees from the database.
 *
 * @returns {Promise<Employee[]>} Get verified employees from the database.
 */
export async function getVerifiedEmployeesFromDatabase() {
  const res = await fetch("/api/employee/get-employees");

  if (res.status === 404) {
    return [];
  }
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
  } else if (employee.isVerified) {
    return "Employee";
  } else {
    return "Unverified";
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
export async function submitOrder(
  orderId: number,
  orderTotal: number,
  custId: number,
  empId: number,
  toast: any,
  chosenItems: any,
  quantities: any
) {
  if (orderTotal <= 0) {
    toast({
      variant: "destructive",
      title: "Cart is empty",
      description: "Please add items to your cart before submitting.",
    });
    return;
  }

  const res = await fetch("/api/employee/submit-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      orderTotal,
      custId,
      empId,
      chosenItems,
      quantities,
    }),
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

/**
 * Get the pairs of items that sold together the most in a given time frame
 * 
 * @param startDate 
 * @param endDate 
 * @returns {PairsAndAppearance[]} List of pairs and how many times they sold 
 */
export async function whatSellsTogether( startDate: string, endDate: string) {
  const res = await fetch(`/api/manager/what-sells-together?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data: PairsAndAppearance[] = await res.json();
  return data;
}

/**
 * Get the top 10 most popular menu items by sales in a given time window 
 * 
 * @param startdate 
 * @param endDate 
 * @returns {PopularMenuItem[]} List of menu items and how many times they sold
 */
export async function menuItemsPopularity( startDate: string, endDate: string) {
  const res = await fetch(`/api/manager/menu-items-popularity?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data: PopularMenuItem[] = await res.json();
  return data;
}

/**
 * Get the days that had the most sales in a given month and year
 * 
 * @param startdate 
 * @param endDate 
 * @returns {SalesForADay[]} List of days and how many sales they had 
 */
export async function daysWithMostSales( month: number, year: number ) {
  const res = await fetch(`/api/manager/days-with-most-sales?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data: SalesForADay[] = await res.json();
  return data;
}

/**
 * Adds a new customer account to the database
 * 
 * @param custName 
 * @param phoneNumber 
 * @returns {string} Message saying whether insertion was successfull or not
 */
export async function newCustomer( custName: string, phoneNumber: string ) {
  const res = await fetch("/api/customer/new-customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      custName,
      phoneNumber
    }),
  });
  return res.json;
}

/**
 * Place an item into its respective category.
 *
 * @param {string | string[]} item The item to be categorized.
 * @param {string} category The category to place the item in.
 * @returns {boolean} Returns true if the item belongs to the category, false otherwise.
 */
export const itemBelongsToCategory = (
  item: string | string[],
  category: string
) => {
  switch (category) {
    case "Burgers & Wraps":
      return (
        item.includes("Burger") ||
        item.includes("Sandwich") ||
        item.includes("Cheeseburger") ||
        item.includes("Hamburger") ||
        item.includes("Melt") ||
        item.includes("Club") ||
        item.includes("Wrap")
      );
    case "Meals":
      return item.includes("Meal");
    case "Tenders":
      return item.includes("Tender");
    case "Sides":
      return item === "French Fries";
    case "Drinks":
      return (
        item.includes("Shake") ||
        item.includes("Water") ||
        item.includes("Drink")
      );
    case "Desserts":
      return (
        item.includes("Sundae") ||
        item.includes("Ice Cream") ||
        item.includes("Float")
      );
    default:
      return false;
  }
};

export const categories = [
  "Burgers & Wraps",
  "Meals",
  "Tenders",
  "Sides",
  "Drinks",
  "Desserts",
];

export const rowToSalesReportItem = (array: any[]) => {
  return {
    id: array[0],
    name: array[1],
    profit: array[2]
  } as SalesReportItem;
}

export const rowToProductUsageItem = (array: any[]) => {
    return {
        id: array[0],
        name: array[1],
        amount: array[2]
    } as ProductUsageItem;
}