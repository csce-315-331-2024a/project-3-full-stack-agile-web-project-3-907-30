import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { DataTypeOIDs } from "postgresql-client";
import handler from "../menu/menu_items/get-all-items-and-price";

describe("handler", () => {
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
    jest.restoreAllMocks();
  });


  it("should return items when items exist", async () => {
    // Mock database response
    const rows = [
    ["1", "Bacon Cheeseburger", "8.29"],
    ["2", "Classic Hamburger", "6.89"],
    ];


    const executeMock = jest.fn().mockResolvedValueOnce({ rows });
    const closeMock = jest.fn();

    const prepareMock = jest
      .spyOn(db, "prepare")
      .mockResolvedValueOnce({ execute: executeMock, close: closeMock } as any);

    await handler(req, res);

    expect(prepareMock).toHaveBeenCalledWith(
      "SELECT item_id, item_name, item_price::numeric FROM menu_items ORDER BY item_id ASC",
    );


    expect(executeMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
    { id: "1", name: "Bacon Cheeseburger", price: "8.29" },
    { id: "2", name: "Classic Hamburger", price: "6.89" },
    ]);
    });

  it("should return 404 error when no item are not found", async () => {
    // Mock database response
    const rows = [];

    const executeMock = jest.fn().mockResolvedValueOnce({ rows: [] });
    const closeMock = jest.fn();

    const prepareMock = jest
      .spyOn(db, "prepare")
      .mockResolvedValueOnce({ execute: executeMock, close: closeMock } as any);

    await handler(req, res);

    expect(prepareMock).toHaveBeenCalledWith(
      "SELECT item_id, item_name, item_price::numeric FROM menu_items ORDER BY item_id ASC"
    );
    expect(executeMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "No menu items found" });
  });



 


});
