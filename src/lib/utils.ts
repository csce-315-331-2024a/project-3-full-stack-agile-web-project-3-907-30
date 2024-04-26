import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Allergens,
  Customer,
  Employee,
  MostProductiveEmployeeItem,
  PairsAndAppearance,
  PopularMenuItem,
  ProductUsageItem,
  SalesForADay,
  SalesReportItem,
  RevenueReportItem,
  ExcessReportItem,
  RestockReportItem,
} from "./types";
import { Pool, QueryResult } from "postgresql-client";
import { InventoryItem, MenuItem } from "@/lib/types";

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
  const res = await statement.execute({ params: params, fetchCount: 100000 });
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
  if (chosenItems.length === 0) {
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
export async function whatSellsTogether(startDate: string, endDate: string) {
  const res = await fetch(
    `/api/manager/what-sells-together?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
export async function menuItemsPopularity(startDate: string, endDate: string) {
  const res = await fetch(
    `/api/manager/menu-items-popularity?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
export async function daysWithMostSales(month: number, year: number) {
  const res = await fetch(
    `/api/manager/days-with-most-sales?month=${encodeURIComponent(
      month
    )}&year=${encodeURIComponent(year)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
export async function newCustomer(custName: string, phoneNumber: string) {
  const res = await fetch("/api/customer/new-customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      custName,
      phoneNumber,
    }),
  });

  const data = await res.json();
  return data.error;
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

/**
 * Saves customer information in local storage.
 * @example
 * putCustomerInLocalStorage(sample_customer)
 * @param {Customer} customer - The customer object to be saved in local storage.
 * @returns {void} No return value.
 * @description
 * - Checks if customer object is null before saving.
 * - If customer object is null, default values are saved.
 * - Customer object must have properties: cust_id, cust_name, phone_number, num_orders, total_spent, points.
 * - If any of these properties are missing, default values will be saved.
 */
export async function putCustomerInLocalStorage(customer: Customer) {
  if (customer !== null) {
    localStorage.setItem("customerId", customer!.cust_id.toString());
    localStorage.setItem("customerName", customer!.cust_name);
    localStorage.setItem("customerPhoneNumber", customer!.phone_number);
    localStorage.setItem("customerNumOrders", customer!.num_orders.toString());
    localStorage.setItem(
      "customerTotalSpent",
      customer!.total_spent.toString()
    );
    localStorage.setItem("customerPoints", customer!.points.toString());
  } else {
    localStorage.setItem("customerId", "no customer ID");
    localStorage.setItem("customerName", "no customer");
    localStorage.setItem("customerPhoneNumber", "no customer phone number");
    localStorage.setItem("customerNumOrders", "no customer orders");
    localStorage.setItem("customerTotalSpent", "no customer total spent");
    localStorage.setItem("customerPoints", "no customer points");
  }
}

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
    profit: array[2],
  } as SalesReportItem;
};

export const rowToProductUsageItem = (array: any[]) => {
  return {
    id: array[0],
    name: array[1],
    amount: array[2],
  } as ProductUsageItem;
};

/**
 * Gets the 10 least selling items from the database.
 *
 * @returns {Promise<MenuItem[]>} Get the 10 least selling menu items from the database.
 */
export async function getLeastSelling() {
  const res = await fetch("/api/manager/get-least-selling");

  if (res.status === 404) {
    return [];
  }
  const data: MenuItem[] = await res.json();
  //console.log(data);
  return data;
}

/**
 * Gets the 5 items which make the smallest contribution to the revenue
 *
 * @returns {Promise<RevenueReportItem[]>} Get the 5 items which make the smallest contribution to the revenue from the database.
 */
export async function getLeastContributing() {
  const res = await fetch("/api/manager/get-least-contributing");

  if (res.status === 404) {
    return [];
  }
  const data: RevenueReportItem[] = await res.json();
  //console.log(data);
  return data;
}

/**
 * Gets the excess report
 *
 * @returns {Promise<ExcessReportItem[]>} Gets the excess report.
 */
export async function getExcessReport(startDate: string) {
  const res = await fetch("/api/manager/get-excess-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
    }),
  });

  if (res.status === 404) {
    return [];
  }
  const data: ExcessReportItem[] = await res.json();
  //console.log(data);
  return data;
}

/**
 * Gets the restock report
 *
 * @returns {Promise<RestockReportItem[]>} Gets the excess report.
 */
export async function getRestockReport() {
  const res = await fetch("/api/manager/get-restock-report");

  if (res.status === 404) {
    return [];
  }
  const data: RestockReportItem[] = await res.json();
  //console.log(data);
  return data;
}

/**
 * Converts a row from the database to a MostProductiveEmployeeItem object.
 *
 * @param {any[]} array Row from SQL query
 * @returns {MostProductiveEmployeeItem} Most productive employee item
 */
export const rowToMostProductiveEmployeeItem = (array: any[]) => {
  return {
    id: array[0],
    name: array[1],
    total_orders: array[2],
  } as MostProductiveEmployeeItem;
};

/**
 * Update the price of a menu item.
 *
 * @param {itemName}  The name of the menu item
 * @param {newPrice}  The new price of the menu item
 */
export async function updateMenuItemPrice(itemName: string, newPrice: number) {
  const res = await fetch("/api/manager/update-menu-item-price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemName,
      newPrice,
    }),
  });
  return res;
}

/**
 * Get the most productive employees within a given date range.
 *
 * @param {string} startDate The start date of the range
 * @param {string} endDate The end date of the range
 * @returns {MostProductiveEmployeeItem[]} The most productive employees within the given date range.
 */
export async function getMostProductiveEmployeesInRange(
  startDate: string,
  endDate: string
) {
  const res = await fetch("/api/manager/get-most-productive", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
    }),
  });

  if (res.status === 404) {
    return [];
  }
  const data: MostProductiveEmployeeItem[] = await res.json();
  return data;
}

/**
 * Get the product usage report within a given date range.
 *
 * @param {string} startDate The start date of the range
 * @param {string} endDate The end date of the range
 * @returns {ProductUsageItem[]} The product usage report within the given date range.
 */
export async function getProductUsageReportInRange(
  startDate: string,
  endDate: string
) {
  const res = await fetch("/api/manager/get-product-usage-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
    }),
  });

  if (res.status === 404) {
    return [];
  }
  const data: ProductUsageItem[] = await res.json();
  return data;
}

/**
 * Get the sales report within a given date range.
 *
 * @param {string} startDate The start date of the range
 * @param {string} endDate The end date of the range
 * @returns {SalesReportItem[]} The sales report within the given date range.
 */
export async function getSalesReportInRange(
  startDate: string,
  endDate: string
) {
  const res = await fetch("/api/manager/get-sales-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
    }),
  });

  if (res.status === 404) {
    return [];
  }
  const data: SalesReportItem[] = await res.json();
  return data;
}

/**
 * Get all inventory items from the database.
 *
 * @returns {InventoryItem[]} The revenue report within the given date range.
 */
export async function getAllInventoryItems() {
  const res = await fetch("/api/inventory/get-all");
  const data: InventoryItem[] = await res.json();
  return data;
}

/**
 * Get an inventory item from the database by its ID.
 *
 * @param {number} id The ID of the inventory item to get.
 * @returns {InventoryItem} The inventory item from the database.
 */
export async function getInventoryItem(id: number) {
  const res = await fetch("/api/inventory/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const data: InventoryItem = await res.json();
  return data;
}

/**
 * Add an inventory item to the database.
 *
 * @param {InventoryItem} item The inventory item to add.
 * @returns {Response} The response from the database.
 */
export async function addInventoryItem(item: InventoryItem) {
  const res = await fetch("/api/inventory/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return res;
}

/**
 * Update an inventory item in the database.
 *
 * @param {InventoryItem} item The inventory item to update.
 * @returns {Response} The response from the database.
 */
export async function updateInventoryItem(item: InventoryItem) {
  const res = await fetch("/api/inventory/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return res;
}

/**
 * Delete an inventory item from the database.
 *
 * @param {number} id The ID of the inventory item to delete.
 * @returns {Response} The response from the database.
 */
export async function deleteInventoryItem(id: number) {
  const res = await fetch("/api/inventory/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  return res;
}

/**
 * Get all orders from the database given an offset.
 *
 * @param {number} page The page number to get the orders from.
 * @returns {number} All orders from the database.
 */
export async function getAllOrders(page: number) {
  const offset = page * 100 + 1;

  const res = await fetch("/api/order/get-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ offset }),
  });
  const data = await res.json();
  return data;
}

/**
 * Get the total number of orders from the database.
 *
 * @returns {number} The total number of orders from the database.
 */
export async function getNumOrders() {
  const res = await fetch("/api/order/get-num-orders");
  const data = await res.json();
  return data;
}

/**
 * Delete an order from the database.
 *
 * @param {number} orderId The ID of the order to delete.
 * @returns {Response} The response from the database.
 */
export async function deleteOrder(orderId: number) {
  const res = await fetch("/api/order/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });

  return res;
}

/**
 * Update an order item's status in the database.
 *
 * @param {number} orderId The ID of the order to update
 * @param {number} status The new status of the order
 * @returns {Response} The response from the database
 */
export async function updateOrderItemStatus(orderId: number, status: number) {
  const res = await fetch("/api/order/update-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId, status }),
  });

  return res;
}

export async function saleAutomation() {
  const res = await fetch("api/manager/sale-automation", {
    method: "PUT"
  })

  return res;
}
