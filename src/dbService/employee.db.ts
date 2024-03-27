import { GoogleAccount } from "../lib/types";
import db from "../lib/db";
import { DataTypeOIDs } from "postgresql-client";

/**
 * Check if an email exists in the database
 *
 * @param {string} email The email to check
 * @returns {boolean} Whether the email exists in the database
 */
async function checkIfEmailExists(email: string) {
  const checkEmailStatement = await db.prepare(
    "SELECT * FROM employees WHERE emp_email=$1",
    {
      paramTypes: [DataTypeOIDs.varchar],
    }
  );

  const checkEmail = await checkEmailStatement.execute({
    params: [email],
  });

  const doesEmailExist = checkEmail.rows!.length > 0;
  await checkEmailStatement.close();

  return doesEmailExist;
}

/**
 * Get the next ID for the employee
 *
 * @returns {Promise<number>} The next ID for the employee
 */
async function getNextId() {
  const latestIdStatement = await db.prepare(
    "SELECT MAX(emp_id) FROM employees",
    {
      paramTypes: [],
    }
  );

  const latestId = await latestIdStatement.execute();
  const latestIdString = latestId.rows![0][0] || "0";

  await latestIdStatement.close();

  return parseInt(latestIdString) + 1;
}

/**
 * Update the name and picture of an employee
 *
 * @param {GoogleAccount} data The data to update the employee with
 */
async function updateEmployeeNameAndPicture(data: GoogleAccount) {
  const updateStatement = await db.prepare(
    "UPDATE employees SET emp_name=$1, emp_picture=$2 WHERE emp_email=$3",
    {
      paramTypes: [
        DataTypeOIDs.varchar,
        DataTypeOIDs.varchar,
        DataTypeOIDs.varchar,
      ],
    }
  );

  await updateStatement.execute({
    params: [data.name, data.picture, data.email],
  });

  await updateStatement.close();
}

/**
 * Add a new employee to the database
 *
 * @param {GoogleAccount} data The Google account to add to the database
 */
async function addNewEmployee(data: GoogleAccount) {
  const nextId = await getNextId();

  const insertStatement = await db.prepare(
    "INSERT INTO employees(emp_id, emp_name, emp_email, emp_picture, is_manager, is_admin) VALUES($1, $2, $3, $4, $5, $6)",
    {
      paramTypes: [
        DataTypeOIDs.int4,
        DataTypeOIDs.varchar,
        DataTypeOIDs.varchar,
        DataTypeOIDs.varchar,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
      ],
    }
  );

  await insertStatement.execute({
    params: [nextId, data.name, data.email, data.picture, false, false],
  });

  await insertStatement.close();
}

/**
 * Login with Google account
 *
 * @param {GoogleAccount} data The Google account to login
 */
export async function loginGoogleAccount(data: GoogleAccount) {
  try {
    const doesEmailExist = await checkIfEmailExists(data.email);

    if (doesEmailExist) {
      await updateEmployeeNameAndPicture(data);
    } else {
      await addNewEmployee(data);
    }
  } catch (error) {
    console.log(error);
  }
}
