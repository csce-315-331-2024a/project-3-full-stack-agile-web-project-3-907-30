import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import handler from "../menu/get-all";


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

 it('should return all menu items if menu_items exists', async () => {
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

   expect(mockPrepare).toHaveBeenCalledWith('SELECT item_id, item_name, item_price::numeric, times_ordered FROM menu_items');
   expect(mockExecute).toHaveBeenCalled();
   expect(mockClose).toHaveBeenCalled();
   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: 'Burger', price: 5.55, times_ordered: 1 },
      { id: 2, name: 'Fries', price: 2.55, times_ordered: 1 },
   ]);
 });

 it('should return 404 when no menu_items exist', async () => {
   const mockExecute = jest.fn().mockResolvedValue({ rows: [] });
   const mockClose = jest.fn();
   const mockPrepare = jest
     .spyOn(db, 'prepare')
     .mockResolvedValue({ execute: mockExecute, close: mockClose } as any);

   await handler(req, res);

   expect(mockPrepare).toHaveBeenCalledWith('SELECT item_id, item_name, item_price::numeric, times_ordered FROM menu_items');
   expect(mockExecute).toHaveBeenCalled();
   expect(mockClose).toHaveBeenCalled();
   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.json).toHaveBeenCalledWith({ error: 'No menu item found' });
 });
});