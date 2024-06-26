import { Translate } from "@google-cloud/translate/build/src/v2";
import { NextApiRequest, NextApiResponse } from "next";

const keyFilename = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS as string);

if (!keyFilename) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS not set in .env");
}

const keys = keyFilename;

const translate = new Translate({
  credentials: keys,
});

/**
 * Get all supported languages for translation
 * 
 * @param {NextApiRequest} req Request object
 * @param {NextApiResponse} res Response object
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    res.setHeader("Content-Type", "application/json");
    // get languages in json format
    const [fetchedLanguages] = await translate.getLanguages();


    const supportedLanguages: { value: string; label: string }[] =
      fetchedLanguages.map((language) => {
        return {
          value: `/auto/${language.code}`,
          label: language.name,
        };
      });

    res.status(200).json({ supportedLanguages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ supportedLanguages: {} });
  }
}
