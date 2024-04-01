import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import handler from "../menu/menu_items/get-all-items-and-price";


describe('handler', () => {
 let req: NextApiRequest;
 let res: NextApiResponse;

 beforeEach(() => {
   req = {} as NextApiRequest;
   res = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
   } as unknown as NextApiResponse;
 });

 afterEach(() => {
   jest.resetAllMocks();
 });

 it('should return price of menu_items when menu_items exist', async () => {
    const mockRows = [
      [1, 'Burger', 5.55, 1],
      [2, 'Fries', 2.55, 1],
    ];
   const mockExecute = jest.fn().mockResolvedValue({ rows: mockRows });
   const mockClose = jest.fn();
   const mockPrepare = jest
     .spyOn(db, 'prepare')
     .mockResolvedValue({ execute: mockExecute, close: mockClose } as any);

   await handler(req, res);

   expect(mockPrepare).toHaveBeenCalledWith('SELECT item_id, item_name, item_price::numeric FROM menu_items ORDER BY item_id ASC');
   expect(mockExecute).toHaveBeenCalled();
   expect(mockClose).toHaveBeenCalled();
   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.json).toHaveBeenCalledWith([
    { id: 1, name: 'Burger', price: 5.55 },
    { id: 2, name: 'Fries', price: 2.55 },
 ]);
 });

 it('should return 404 when no menu_items exist', async () => {
   const mockExecute = jest.fn().mockResolvedValue({ rows: [] });
   const mockClose = jest.fn();
   const mockPrepare = jest
     .spyOn(db, 'prepare')
     .mockResolvedValue({ execute: mockExecute, close: mockClose } as any);

   await handler(req, res);

   expect(mockPrepare).toHaveBeenCalledWith('SELECT item_id, item_name, item_price::numeric FROM menu_items ORDER BY item_id ASC');
   expect(mockExecute).toHaveBeenCalled();
   expect(mockClose).toHaveBeenCalled();
   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.json).toHaveBeenCalledWith({ error: 'No menu items found' });
 });

  it('should return 500 when an error occurs', async () => {
    const mockPrepare = jest.spyOn(db, 'prepare').mockRejectedValue(new Error('test error'));

    await handler(req, res);

    expect(mockPrepare).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

