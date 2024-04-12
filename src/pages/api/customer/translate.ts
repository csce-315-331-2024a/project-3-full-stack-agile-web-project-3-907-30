import { Translate } from '@google-cloud/translate/build/src/v2';
import * as fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';


const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if(!keyFilename) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS not set in .env');
}

const keys = JSON.parse(fs.readFileSync(keyFilename, 'utf8'));

const translate = new Translate({
  credentials: keys,
});

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    const { text, from, to } = req.body;
    const [translation] = await translate.translate(text, { from, to });
    res.status(200).json({ translation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ translation: '' });
  }
};