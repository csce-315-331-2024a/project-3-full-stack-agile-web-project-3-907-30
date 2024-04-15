import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { InventoryItem, MenuItem } from "@/lib/types";
import { toast } from "../ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Allergens } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { categories, itemBelongsToCategory } from "@/lib/utils";

export interface OrderItem extends MenuItem {
  quantity: number;
}

interface MenuOrderProps {
  setOrderItems: (items: OrderItem[]) => void;
  clearOrder: () => void;
}


/**
 * Component that displays a menu of items and allows users to add items to an order.
 * @component
 * @example
 *   <Menu setOrderItems={setOrderItems} clearOrder={clearOrder} />
 * @prop {function} setOrderItems - Function to set the order items state in the parent component.
 * @prop {function} clearOrder - Function to clear the order state in the parent component.
 * @description
 *   - Uses an API call to fetch menu items and displays them in a grid.
 *   - Allows users to add items to an order by selecting a quantity and clicking a button.
 *   - Displays a notification if an item is low in stock.
 *   - Allows users to view allergens information for each item.
 *   - Uses state variables to manage the order, input values, allergens, and open/closed status of allergens modals.
 *   - Uses useEffect to fetch menu items on component mount.
 *   - Uses useState to set the menu items, loading status, order, input values, allergens, and open/closed status of allergens modals.
 *   - Uses immutability to update the order state when adding or removing items.
 *   - Uses a fetchPriceAndAddToOrder function to fetch item information and add it to the order.
 *   - Uses a checkLowStock function to check for low stock and display a notification if necessary.
 *   - Uses an addToOrder function to add an item to the order and update the order items list.
 *   - Uses a removeItemFromOrder function to decrease the quantity of an item in the order or remove it if the quantity is 1.
 *   - Uses a getAllergensForItem function to fetch allergens data for a specific menu item.
 *   - Uses a fetchPriceAndAddToOrder function to fetch item information and add it to the order.
 *   - Uses a checkLowStock function to check for low stock and display a notification if necessary.
 *   - Uses an addToOrder function to add an item to the order and update the order items list.
 *   - Uses a removeItemFromOrder function to decrease the quantity of an item in the order or remove it if the quantity is 1.
 *   - Uses a getAllergensForItem function to fetch allergens data for a specific menu item.
 */
const MenuOrder: React.FC<MenuOrderProps> = ({ setOrderItems, clearOrder }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<{ [key: string]: OrderItem }>({});
  const [inputValues, setInputValues] = useState<{ [key: string]: number }>({});
  const [currentAllergens, setAllergens] = useState<Allergens>();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/menu/menu_items/get-all-items")
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
        const strings = data as string[];
        strings.map((row) => {
          setOpen({ ...open, [row]: false });
        });
      });
  }, []);

  /**
   * Clear the order state and set the order items to an empty array
   * @description
   * - Resets the order state to an empty object
   * - Resets the input values to an empty object
   * - Calls the clearOrder prop function
   */
  const clearOrderAndSetOrderItems = () => {
    setOrder({}); // Reset the order state
    setInputValues({}); // Reset the input values
    clearOrder(); // Call the clearOrder prop
  };

/**
   * Component that adds items to an order based on user input
   * @example
   *   <AddToOrder itemName="Burger" />
   * @prop {string} itemName - Name of the item to be added to the order
   * @description
   *   - Uses user input to fetch item information from an API
   *   - Validates the item price and quantity before adding it to the order
   *   - Checks for low stock and displays a notification if necessary
   *   - Handles errors that may occur during the process
   */
  const fetchPriceAndAddToOrder = async (itemName: string) => {
    try {
      const quantity = inputValues[itemName] ?? 1;

      if (quantity <= 0) {
        return; // Do not add items with a quantity of 0 or less to the order
      }
      const response = await fetch(`/api/menu/${itemName}`);

      if (!response.ok) {
        throw new Error("Item not found or error fetching item price");
      }
      const data = await response.json();
      const id = data.id;
      const times_ordered = data.times_ordered;
      const price = data.price;

      if (!isNaN(price)) {
        // Check if the parsed price is a valid number
        await checkLowStock(id).then((rows) => {
          if (!(rows === undefined || rows.length === 0)) {
            toast({
              title: "Low Stock Notification ⓘ",
              description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">
                    {rows!
                      .map((row) => {
                        return (
                          row.name.toUpperCase() +
                          `\n\t- Current: ${row.curr_level}\n\t- Required: ${row.fill_level}`
                        );
                      })
                      .join("\n\n")}
                  </code>
                </pre>
              ),
            });
          }
        });
        addToOrder(id, String(itemName), price, times_ordered, quantity);
      } else {
        throw new Error("Invalid price received");
      }
    } catch (error) {
      console.error("Error fetching item price:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };

/**
   * Fetches the inventory item with the given id from the menu and checks its stock.
   * @example
   * checkStock(123)
   * @param {number} id - The id of the inventory item to be checked.
   * @returns {InventoryItem[]} An array of inventory items with the given id and their stock status.
   * @description
   *   - Makes an API call to fetch the inventory item with the given id.
   *   - Throws an error if the item is not found.
   *   - Parses the response as an array of InventoryItem objects.
   *   - Returns the array of inventory items with their stock status.
   */
  const checkLowStock = async (id: number) => {
    try {
      const res = await fetch(`/api/menu/check-stock/${id}`);

      if (!res.ok) {
        throw new Error("Item not found");
      }

      const data = (await res.json()) as InventoryItem[];
      return data;
    } catch (error) {
      console.error("Error fetching item price:", error);
    }
  };

/**
   * Adds an item to the order and updates the order items list.
   * @example
   * addItem(1, "Pizza", 10.99, 5, 2)
   * @param {number} id - The unique identifier for the item.
   * @param {string} itemName - The name of the item.
   * @param {number} price - The price of the item.
   * @param {number} times_ordered - The number of times the item has been ordered.
   * @param {number} quantity - The quantity of the item to be added to the order.
   * @returns {object} The updated order with the added item.
   * @description
   *   - If the item already exists in the order, the quantity will be updated.
   *   - The order items list will be updated with the added item.
   *   - The updated order will be returned.
   *   - The added item will have a unique identifier, name, price, times ordered, and quantity.
   */
  const addToOrder = (
    id: number,
    itemName: string,
    price: number,
    times_ordered: number,
    quantity: number
  ) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder[itemName] || {
        id,
        name: itemName,
        price,
        times_ordered,
        quantity: 0,
      };
      const updatedQuantity = existingItem.quantity + quantity;
      const updatedItem = {
        id,
        name: itemName,
        price,
        times_ordered,
        quantity: updatedQuantity,
      };
      const newOrder = { ...prevOrder, [itemName]: updatedItem };
      setOrderItems(Object.values(newOrder));
      return newOrder;
    });
  };

/**
   * Updates the order by decreasing the quantity of the specified item by 1, or removing it if the quantity is 1.
   * @example
   * updateOrder("apple")
   * @param {string} itemName - The name of the item to be updated.
   * @returns {object} The updated order with the specified item's quantity decreased by 1, or removed if the quantity is 1.
   * @description
   * - Uses immutability to update the order.
   * - If the specified item's quantity is 1, it will be removed from the order.
   * - The updated order is also set as the order items state.
   * - Only works for items that already exist in the order.
   */
  const removeItemFromOrder = (itemName: string) => {
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      const existingItem = newOrder[itemName];
      if (existingItem && existingItem.quantity > 1) {
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity - 1,
        }; // Ensure immutability
        newOrder[itemName] = updatedItem;
      } else {
        delete newOrder[itemName];
      }
      setOrderItems(Object.values(newOrder));
      return newOrder;
    });
  };

/**
   * Fetches allergens data for a specific menu item.
   * @example
   * getAllergens("Burger")
   * @param {string} name - The name of the menu item.
   * @returns {Allergens} Allergens data for the specified menu item.
   * @description
   *   - Makes an asynchronous call to the server to retrieve allergens data.
   *   - Throws an error if the response is not successful.
   *   - Sets the retrieved data to the state variable "allergens".
   *   - Logs an error if there is an error while retrieving the data.
   */
  const getAllergensForItem = async (name: string) => {
    try {
      const res = await fetch(`/api/menu/allergens/${name}`);

      if (!res.ok) {
        throw new Error("Item not found");
      }

      const data = (await res.json()) as Allergens;
      setAllergens(data);
    } catch (error) {
      console.error("Error getting allergens", error);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Menu</CardTitle>
        <CardDescription>Select your items</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 h-full">
        {loading ? (
          <div>Loading menu items...</div>
        ) : (
          <>
            <Button
              onClick={clearOrderAndSetOrderItems}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-8 px-2 text-lg rounded"
            >
              Clear Order
            </Button>
            <Tabs
              defaultValue="Burgers&Wraps"
              className="w-full flex flex-col gap-2 h-full"
            >
              <TabsList className="grid grid-cols-6 w-full h-fit">
                {categories.map((category, index) => (
                  <TabsTrigger
                    key={index}
                    value={category.replace(/\s/g, "")}
                    className={`p-4 cursor-pointer relative`}
                    onMouseEnter={() => setHoveredTab(index)}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    <h2>{category}</h2>
                    {hoveredTab === index && (
                      <div className="absolute inset-0 border-2 border-gray-300 rounded pointer-events-none transition-all duration-500"></div>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent
                  key={category}
                  value={category.replace(/\s/g, "")}
                  className="h-full"
                >
                  <div key={category} className="h-full overflow-y-scroll">
                    <div className="grid grid-cols-4 gap-4 h-[100px]">
                      {menuItems
                        .filter((item) => itemBelongsToCategory(item, category))
                        .map((item) => (
                          <Card
                            key={item}
                            className="flex flex-col justify-between gap-8 items-center py-3"
                          >
                            <h3 className="text-center font-semibold">
                              {item}
                            </h3>
                            <div className="flex items-center gap-2">
                              <AlertDialog open={open[item]}>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    onClick={async () => {
                                      await getAllergensForItem(item);
                                      setOpen({ ...open, [item]: true });
                                    }}
                                  >
                                    +
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Dietary Restrictions
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Dairy?{" "}
                                      {currentAllergens?.has_dairy
                                        ? "Yes"
                                        : "No"}
                                    </AlertDialogDescription>
                                    <AlertDialogDescription>
                                      Eggs?{" "}
                                      {currentAllergens?.has_eggs
                                        ? "Yes"
                                        : "No"}
                                    </AlertDialogDescription>
                                    <AlertDialogDescription>
                                      Nuts?{" "}
                                      {currentAllergens?.has_nuts
                                        ? "Yes"
                                        : "No"}
                                    </AlertDialogDescription>
                                    <AlertDialogDescription>
                                      Vegan?{" "}
                                      {currentAllergens?.is_vegan
                                        ? "Yes"
                                        : "No"}
                                    </AlertDialogDescription>
                                    <AlertDialogDescription>
                                      Halal?{" "}
                                      {currentAllergens?.is_halal
                                        ? "Yes"
                                        : "No"}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel asChild>
                                      <Button
                                        onClick={() =>
                                          setOpen({ ...open, [item]: false })
                                        }
                                        className="text-black"
                                      >
                                        Cancel
                                      </Button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                      <Button
                                        onClick={() => {
                                          fetchPriceAndAddToOrder(item);
                                          setOpen({ ...open, [item]: false });
                                        }}
                                      >
                                        Confirm
                                      </Button>
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <Input
                                type="number"
                                value={
                                  inputValues[item] ??
                                  order[item]?.quantity ??
                                  0
                                }
                                onChange={(e) =>
                                  setInputValues({
                                    ...inputValues,
                                    [item]: parseInt(e.target.value),
                                  })
                                }
                                min={0}
                                className="w-16"
                              />
                              <Button onClick={() => removeItemFromOrder(item)}>
                                -
                              </Button>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuOrder;
