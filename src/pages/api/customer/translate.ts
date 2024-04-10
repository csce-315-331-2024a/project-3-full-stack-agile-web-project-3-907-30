import translate from 'google-translate-api-next';
import { NextApiRequest, NextApiResponse } from 'next';



/**
 * The handler for the customer translate API.
 * 
 * @param {NextApiRequest} req The request object.
 * @param {NextApiResponse} res The response object.
 * @returns {Promise<void>} The response object.
 */


export type Translate = {
  translation: string;
};


export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try{

    const { text, from, to } = req.body;
    const translation = await translate(text, { from, to });
    res.status(200).json({ translation });

  } catch (error) {
    res.status(500).json({ translation: '' });
  }
  
}






