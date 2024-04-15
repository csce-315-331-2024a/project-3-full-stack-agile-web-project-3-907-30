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



  // Test case for get-all-items-and-price
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



  // Test case for if no items are found
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


  // Test case for database query failure
  it("should return 500 error when database query fails", async () => {
    const prepareMock = jest
      .spyOn(db, "prepare")
      .mockRejectedValueOnce(new Error("Database error"));

    await handler(req, res);

    expect(prepareMock).toHaveBeenCalledWith(
      "SELECT item_id, item_name, item_price::numeric FROM menu_items ORDER BY item_id ASC"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });


  // Test if item id is wrong item
  it("should return items when items exist", async () => {
    // Mock database response
    const rows = [
    ["1", "Mushroom Cheeseburger", "8.29"],
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
    { id: "1", name: "Mushroom Cheeseburger", price: "8.29" },
    ]);
    });

    // Test if one of the responses from db is null
    it("should return 500 error when databse returns null", async () => {

      const rows = [
        ["1", null, "8.29"],
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
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
      
    });

    // Test if one of the responses from db is empty
    it("should return 404 error when one of the rows is empty", async () => {
      const rows = [
        ["1", "Bacon Cheeseburger", "8.29"],
        [],
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
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
      
    });




});
