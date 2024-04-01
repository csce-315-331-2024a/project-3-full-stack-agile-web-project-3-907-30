import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";
import handler from "../order/get-next-order-id";

describe("handler Function", () => {
  let req: NextApiRequest;
  let res: NextApiResponse;

  beforeEach(() => {
    // req = {
    //   body: {
    //   },
    // } as NextApiRequest;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return the next available order id", async () => {
    // Mock database response
    const rows = [[1, "2024-03-31", "22:28:32", 30, 1, 1]];

    const executeMock = jest.fn().mockResolvedValueOnce({ rows });
    const closeMock = jest.fn();

    const prepareMock = jest
      .spyOn(db, "prepare")
      .mockResolvedValueOnce({ execute: executeMock, close: closeMock } as any);

    await handler(req, res);

    //expect(executeMock).toHaveBeenCalledWith({ params: [expect.any(Number)] });
    expect(closeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      nextOrderId: 2
    });
  });

  it("should return 404 error when the query fails", async () => {
    // Mock database response
    const rows = [];

    const executeMock = jest.fn().mockResolvedValueOnce({ rows: [] });
    const closeMock = jest.fn();

    const prepareMock = jest
      .spyOn(db, "prepare")
      .mockResolvedValueOnce({ execute: executeMock, close: closeMock } as any);

    await handler(req, res);

    // expect(prepareMock).toHaveBeenCalledWith(
    //   "SELECT order_id FROM orders ORDER BY order_id DESC LIMIT $1",
    //   { paramTypes: [DataTypeOIDs.varchar] }
    // );
    //expect(executeMock).toHaveBeenCalledWith({ params: [expect.any(String)] });
    expect(closeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Query to get next order ID failed" });
  });

  // Add more test cases for edge cases and boundary conditions
});
