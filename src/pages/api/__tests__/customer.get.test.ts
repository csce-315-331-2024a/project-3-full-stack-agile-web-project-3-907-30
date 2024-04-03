import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";
import handler from "../customer/get";

describe("handler Function", () => {
  let req: NextApiRequest;
  let res: NextApiResponse;

  beforeEach(() => {
    req = {
      body: {
        phone: "1234567890", // Sample phone number
      },
    } as NextApiRequest;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return customer details when customer is found", async () => {
    // Mock database response
    const rows = [["1", "John Doe", "1234567890", 10, 100.5, 200]];

    const executeMock = jest.fn().mockResolvedValueOnce({ rows });
    const closeMock = jest.fn();

    const prepareMock = jest
      .spyOn(db, "prepare")
      .mockResolvedValueOnce({ execute: executeMock, close: closeMock } as any);

    await handler(req, res);

    expect(prepareMock).toHaveBeenCalledWith(
      "SELECT cust_id, cust_name, phone_number, num_orders, total_spent::numeric, points FROM customers WHERE phone_number = $1",
      { paramTypes: [DataTypeOIDs.varchar] }
    );
    expect(executeMock).toHaveBeenCalledWith({ params: [expect.any(String)] });
    expect(closeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      cust_id: "1",
      cust_name: "John Doe",
      phone_number: "1234567890",
      num_orders: 10,
      total_spent: 100.5,
      points: 200,
    });
  });

  it("should return 404 error when customer is not found", async () => {
    // Mock database response
    const rows = [];

    const executeMock = jest.fn().mockResolvedValueOnce({ rows: [] });
    const closeMock = jest.fn();

    const prepareMock = jest
      .spyOn(db, "prepare")
      .mockResolvedValueOnce({ execute: executeMock, close: closeMock } as any);

    await handler(req, res);

    expect(prepareMock).toHaveBeenCalledWith(
      "SELECT cust_id, cust_name, phone_number, num_orders, total_spent::numeric, points FROM customers WHERE phone_number = $1",
      { paramTypes: [DataTypeOIDs.varchar] }
    );
    expect(executeMock).toHaveBeenCalledWith({ params: [expect.any(String)] });
    expect(closeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Customer not found" });
  });

});
