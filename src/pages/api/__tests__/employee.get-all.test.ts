import { NextApiRequest, NextApiResponse } from 'next';
import { Employee } from '../../../lib/types';
import db from '../../../lib/db';
import handler from "../employee/get-all";


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

 it('should return employees when employees exist', async () => {
   const mockRows = [
     [1, 'John Doe', 'john@example.com', null, true, false, true],
     [2, 'Jane Smith', 'jane@example.com', null, false, false, true],
   ];
   const mockExecute = jest.fn().mockResolvedValue({ rows: mockRows });
   const mockClose = jest.fn();
   const mockPrepare = jest
     .spyOn(db, 'prepare')
     .mockResolvedValue({ execute: mockExecute, close: mockClose } as any);

   await handler(req, res);

   expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM employees ORDER BY emp_id ASC');
   expect(mockExecute).toHaveBeenCalled();
   expect(mockClose).toHaveBeenCalled();
   expect(res.status).toHaveBeenCalledWith(200);
   expect(res.json).toHaveBeenCalledWith([
     { empId: 1, empName: 'John Doe', empEmail: 'john@example.com', empPicture: null, isManager: true, isAdmin: false, isVerified: true },
     { empId: 2, empName: 'Jane Smith', empEmail: 'jane@example.com', empPicture: null, isManager: false, isAdmin: false, isVerified: true },
   ]);
 });

 it('should return 404 when no employees exist', async () => {
   const mockExecute = jest.fn().mockResolvedValue({ rows: [] });
   const mockClose = jest.fn();
   const mockPrepare = jest
     .spyOn(db, 'prepare')
     .mockResolvedValue({ execute: mockExecute, close: mockClose } as any);

   await handler(req, res);

   expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM employees ORDER BY emp_id ASC');
   expect(mockExecute).toHaveBeenCalled();
   expect(mockClose).toHaveBeenCalled();
   expect(res.status).toHaveBeenCalledWith(404);
   expect(res.json).toHaveBeenCalledWith({ error: 'No employees found' });
 });
});