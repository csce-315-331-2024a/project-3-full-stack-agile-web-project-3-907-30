import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";
import handler from "../employee/get";

describe("handler Function", () => {
  let req: NextApiRequest;
  let res: NextApiResponse;

  beforeEach(() => {
    req = {
      body: {
        email: "john@example.com", // Sample email
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

  it("should return employee details when employee is found", async () => {
    // Mock database response
    const rows = [[1, 'John Doe', 'john@example.com', null, true, false, true], [2, 'Jane Smith', 'jane@example.com', null, false, false, true],];

    const executeMock = jest.fn().mockResolvedValueOnce({ rows });
    const closeMock = jest.fn();

    const prepareMock = jest
      .spyOn(db, "prepare")
      .mockResolvedValueOnce({ execute: executeMock, close: closeMock } as any);

    await handler(req, res);

    expect(prepareMock).toHaveBeenCalledWith(
      "SELECT * FROM employees WHERE emp_email = $1",
      { paramTypes: [DataTypeOIDs.varchar] }
    );
    expect(executeMock).toHaveBeenCalledWith({ params: [expect.any(String)] });
    expect(closeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        empId: 1,
        empName: "John Doe",
        empEmail: "john@example.com",
        empPicture: null,
        isManager: true,
        isAdmin: false,
        isVerified: true
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
      "SELECT * FROM employees WHERE emp_email = $1",
      { paramTypes: [DataTypeOIDs.varchar] }
    );
    expect(executeMock).toHaveBeenCalledWith({ params: [expect.any(String)] });
    expect(closeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Employee not found" });
  });

  // Add more test cases for edge cases and boundary conditions
});
