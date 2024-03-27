import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Employee } from "./types";

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
