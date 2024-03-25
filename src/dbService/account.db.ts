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
    'SELECT * FROM account WHERE "email" = $1',
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
 * Get the next ID for the account
 *
 * @returns {Promise<number>} The next ID for the account
 */
async function getNextId() {
  const latestIdStatement = await db.prepare('SELECT MAX("id") FROM account', {
    paramTypes: [],
  });

  const latestId = await latestIdStatement.execute();
  const latestIdString = latestId.rows![0][0] || "0";

  await latestIdStatement.close();

  return parseInt(latestIdString) + 1;
}

/**
 * Update the name and picture of an account
 *
 * @param {GoogleAccount} data The data to update the account with
 */
async function updateAccountNameAndPicture(data: GoogleAccount) {
  const updateStatement = await db.prepare(
    'UPDATE account SET "name" = $1, "picture" = $2 WHERE "email" = $3',
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
 * Add a new account to the database
 *
 * @param {GoogleAccount} data The data to add to the database
 */
async function addNewAccount(data: GoogleAccount) {
  const nextId = await getNextId();

  const insertStatement = await db.prepare(
    'INSERT INTO account("id", "name", "email", "picture", "is_employee", "is_manager", "is_admin", "points") VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    {
      paramTypes: [
        DataTypeOIDs.int4,
        DataTypeOIDs.varchar,
        DataTypeOIDs.varchar,
        DataTypeOIDs.varchar,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.bool,
        DataTypeOIDs.int4,
      ],
    }
  );

  await insertStatement.execute({
    params: [
      nextId,
      data.name,
      data.email,
      data.picture,
      false,
      false,
      false,
      0,
    ],
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
      await updateAccountNameAndPicture(data);
    } else {
      await addNewAccount(data);
    }
  } catch (error) {
    console.log(error);
  }
}
