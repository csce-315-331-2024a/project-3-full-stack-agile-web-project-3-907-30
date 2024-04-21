//customer-view.tsx
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { categories, itemBelongsToCategory } from '@/lib/utils';
import { Allergens } from '@/lib/types';
import CustomerOrders from './customer-orders';
import CustomerWeatherReccs from './weather-recc';
import { Weather } from '@/pages/api/customer/weather';
import { getCurrentWeather } from './customer-weather';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Switch } from "../ui/switch";

import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";

import shoppingCart from "../../../public/shopping-cart.svg";
import editOrderImage from "../../../public/editOrderImage.svg";


import { submitOrder } from "@/lib/utils";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

/**
 * Displays a menu with different categories and items to choose from.
 * @component
 * @example
 *   <Menu prop1={sample_value1} prop2={sample_value2} />
 * @prop {any[]} menuItems - An array of objects containing menu item names, prices, and ingredients.
 * @prop {any[]} ingredients - An array of strings representing the ingredients for a specific menu item.
 * @prop {any} selectedItem - An object representing the currently selected menu item.
 * @prop {any} hoveredItem - An object representing the currently hovered menu item.
 * @prop {number | null} hoveredTab - A number representing the currently hovered tab, or null if no tab is hovered.
 * @prop {Allergens} currentAllergens - An Allergens object depicting the boolean state of the current selected item.
 * @description
 *   - Uses state variables to keep track of selected and hovered menu items and tabs.
 *   - Makes API calls to retrieve menu items and their corresponding ingredients.
 *   - Uses React Dialog component to display more information about a selected menu item.
 *   - Uses React Tabs component to display different categories of menu items.
 */
const CustomerView = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [currentAllergens, setAllergens] = useState<Allergens>();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentWeather, setWeather] = useState<Weather>();

  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [customerPoints, setCustomerPoints] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);

  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const { toast } = useToast();

  const [openedPopoverItem, setOpenedPopoverItem] = useState<OrderItem | null>(null);
  const [ingredientQuantities, setIngredientQuantities] = useState<{
    [key: string]: { [key: string]: number };
  }>({});// Object to store the quantities of each ingredient for the currently opened popover item


  /**
   * Function to handle when an item is clicked
   * @param item - The item that was clicked.
   */
  const itemClicked = async (item: any) => {
    setSelectedItem(item);
    await getAllergensForItem(item.name);
  };


  /**
   * Function to get the ingredients for a specific item
   * @param itemID - ID of the item.
   * @returns - The ingredients for the item.
   */
  // Getting the Ingredient names using the ItemID
  const getIngredientsUsingItemID = async (itemID: number) => {
    const res = await fetch(`/api/menu/ingredients/${itemID}`)
    const data = await res.json();
    const ingredientNames = data.map((ingredient: any) => ingredient.name);
    return ingredientNames;
  };


  /**
   * Function to get all the menu items and their prices.
   * @returns - The menu items and their prices.
   */
  useEffect(() => {
    fetch('/api/menu/menu_items/get-all-items-and-price')
      .then((res) => res.json())
      .then(async (data) => {
        // Get the ingredients for each item
        const ingredientPromises = data.map(async (item: any) => {
          const ingredients = await getIngredientsUsingItemID(item.id);

          return {
            originalName: item.name,
            name: item.name,
            price: item.price,
            ingredients: ingredients,
          };
        });
        // Wait for all the ingredients and translations to be fetched
        const items = await Promise.all(ingredientPromises);
        const itemsWithID = items.map((item, index) => ({
          ...item,
          id: data[index].id,
        }));
        setMenuItems(itemsWithID);
      });
    getCurrentWeather().then((weather) => {
      setWeather(weather);
    })
  }, []);


  /**
   * Function to get the image for a specific menu item
   * @param itemID - ID of the item.
   * @returns - The image URL for the menu items.
   */
  // Retrieve the image for menu item using the item ID
  const getImageForMenuItem = (itemID: number) => {
    return `/menu-item-pics/${itemID}.jpeg`;
  };


  /**
   * Function to get allergens for a specific item
   * @param name - Name of the item.
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

  const addItemToOrder = (item: any, quantity: number) => {
    setOrderItems((prevOrderItems) => [
      ...prevOrderItems,
      { name: item.name, price: item.price, quantity },
    ]);
  };

  const clearOrder = () => {
    setOrderItems([]);

    // Clear the ingredient quantities for all items
    setIngredientQuantities({});
  }



  useEffect(() => {
    const calculateTotals = () => {
      const calculatedSubTotal = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const calculatedTax = calculatedSubTotal * 0.07; // Assuming a tax rate of 7%
      let calculatedTotal =
        calculatedSubTotal +
        calculatedTax -
        (isSwitchToggled ? totalPoints : 0);

      if (isSwitchToggled && totalPoints > calculatedTotal) {
        calculatedTotal = 0; // Set total to 0 if points cover the entire order
      } else if (isSwitchToggled && totalPoints < calculatedTotal) {
        calculatedTotal -= totalPoints; // Subtract points from total
      }

      setSubTotal(calculatedSubTotal);
      setTax(calculatedTax);
      setTotal(calculatedTotal);
    };

    calculateTotals();
  }, [orderItems, isSwitchToggled, totalPoints]);

  /**
   * Submits an order for the current employee with the given email address and displays a toast notification with the order ID.
   * @example
   * submitOrder('johndoe@example.com', 100)
   * @param {string} email - The email address of the current employee.
   * @param {number} total - The total cost of the order.
   * @returns {boolean} Returns true if the order was successfully submitted, false otherwise.
   * @description
   *   - Retrieves the employee's information from the database using their email address.
   *   - Gets the next available order ID.
   *   - Displays a toast notification with the order ID.
   *   - Submits the order with the given order ID, total cost, employee ID, and toast notification function.
   */
  const customerSubmitOrder = async () => {
    try {
      const employee = 1;
      const nextOrderId = await getNextOrderId();

      toast({
        title: "Order ID",
        description: nextOrderId,
      });

      const chosenItems = orderItems.map((item) => item.name);
      const quantities = orderItems.map((item) => item.quantity);
      let total = subTotal + tax - (isSwitchToggled ? totalPoints : 0);

      if (isSwitchToggled && totalPoints > total) {
        total = 0;
      } else if (isSwitchToggled && totalPoints < total) {
        total -= totalPoints;
      }

      const res = await submitOrder(
        nextOrderId,
        total,
        1,
        employee,
        toast,
        chosenItems,
        quantities
      );

      let newPoints = 0;
      // if points aren't used, and order is successful, update customer points
      if (!isSwitchToggled && res && res.status === 200) {
        let updatedPoints = customerPoints ? parseInt(customerPoints, 10) - total : 0;
        // get sum of points for all items in order
        const itemNames = orderItems
          .map((item) => Array(item.quantity).fill(item.name))
          .flat();

        // loop through item names and get points for each item and sum them

        for (const itemName of itemNames) {
          const response = await fetch(
            `/api/order/get-points-for-item?itemName=${itemName}`
          );
          const data = await response.json();
          newPoints += parseInt(data.points, 10);
        }

        updatedPoints += newPoints;
        // round updatePoints to whole number
        updatedPoints = Math.round(updatedPoints);
        if (customerId && updatedPoints >= 0) {
          await updateCustomerPoints(updatedPoints, parseInt(customerId, 10));
          localStorage.setItem("customerPoints", updatedPoints.toString());
        }
      }

      if (res && res.status === 200) {
        toast({
          title: "Success!",
          description: `Your order has been placed! You recieved ${newPoints} from this order!`,
        });

        // Update used_points column in orders table
        fetch("/api/order/update-usedpointsbool", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: nextOrderId,
            used_points: isSwitchToggled ? true : false,
          }),
        });

        console.log("Order submitted successfully.")

      } else {
        throw new Error("There was a problem with your request.");
      }

      // Clear the order after submitting
      clearOrder();

      // Reset the order number
      const newOrderId = await getNextOrderId();
      setOrderNumber(newOrderId);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        variant: "destructive",
        title: "Cart is empty!",
        description: "Please add items to your cart before submitting.",
      });
    }
  };

  /**
   *  Fetches the next available order ID from the server.
   * @returns {number} The next available order ID.
   */
  const getNextOrderId = async () => {
    const response = await fetch("/api/order/get-next-order-id");
    const data = await response.json();
    return data.nextOrderId;
  };

  /**
     * Updates the customer's points in the database.
     * updateCustomerPoints(100, 12345)
     * @param {number} points - The number of points to be added to the customer's current points.
     * @param {number} customerId - The ID of the customer whose points will be updated.
     * @returns {object} The updated customer data.
     * @description
     *   - This function uses the fetch API to make a PUT request to the specified endpoint.
     *   - The customer's ID and the number of points to be added are passed as parameters.
     *   - The response from the server is converted to JSON and returned.
     *   - This function is asynchronous and will wait for the response before returning the updated data.
     */
  const updateCustomerPoints = async (points: number, customerId: number) => {
    const response = await fetch("/api/customer/update-customer-points", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cust_id: customerId,
        points: points,
      }),
    });
    const data = await response.json();
    return data;
  };

  /**
     * Calculates the total points for a customer's order based on the items and their quantities.
     * calculateTotalPoints([{name: "apple", quantity: 2}, {name: "banana", quantity: 3}])
     * @param {Array} items - An array of objects containing the name and quantity of each item.
     * @returns {Number} The total points for the customer's order.
     * @description
     *   - Uses the items array to create a flattened array of item names with duplicates.
     *   - Loops through the item names and fetches the points for each item from the API.
     *   - Calculates the total points by summing the points for each item.
     *   - Checks if the customer has enough points and returns the total points if so.
     *   - If the customer does not have enough points, returns 0 and displays a toast message.
     */
  const getTotalPointsValueForOrder = async () => {
    // create flattened array of item names that has duplicates
    const itemNames = orderItems
      .map((item) => Array(item.quantity).fill(item.name))
      .flat();

    // loop through item names and get points for each item and sum them
    let totalPoints = 0;
    for (const itemName of itemNames) {
      const response = await fetch(
        `/api/order/get-points-for-item?itemName=${itemName}`
      );
      const data = await response.json();
      totalPoints += parseInt(data.points, 10);
    }

    // if customer has enough points, return total points
    // otherwise return 0
    const customer_points = localStorage.getItem("customerPoints");
    if (customer_points && parseInt(customer_points, 10) >= totalPoints) {
      setTotalPoints(totalPoints);
    } else {
      setTotalPoints(0);
      toast({
        variant: "destructive",
        title: "Uh oh! You don't have enough points.",
        description: "Please choose an alternative payment method.",
      });
    }
  };

  const removeItemFromOrder = (itemIndex: number) => {
    setOrderItems((prevOrderItems) => {
      const updatedOrderItems = [...prevOrderItems];
      updatedOrderItems.splice(itemIndex, 1);
      return updatedOrderItems;
    });

    getTotalPointsValueForOrder();
    setOpenedPopoverItem(null);

    // Clear the ingredient quantities for the removed item
    const updatedIngredientQuantities = { ...ingredientQuantities };
    const removedItem = orderItems[itemIndex];
    if (removedItem) {
      delete updatedIngredientQuantities[removedItem.name];
    }
    setIngredientQuantities(updatedIngredientQuantities);
  };


  useEffect(() => {
    const fetchOrderNumber = async () => {
      const nextOrderId = await getNextOrderId();
      setOrderNumber(nextOrderId);
    };

    fetchOrderNumber();
  }, []);

  useEffect(() => {
    const points = localStorage.getItem("customerPoints");
    const name = localStorage.getItem("customerName");
    const id = localStorage.getItem("customerId");
    if (points) {
      setCustomerPoints(points);
      setCustomerName(name);
      setCustomerId(id);
    }
  }, []);


  return (
    <div className="w-full h-full flex flex-col justify-start items-start p-4 relative">
      <div className="absolute top-0 right-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className='bg-white border border-gray-30 transition duration-500 hover:bg-rev_yellow'>
              <Image
                src={shoppingCart}
                alt="Shopping Cart"
                className="w-10 h-15 rounded-sm"
              />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Your Order</SheetTitle>
              <SheetDescription className='pb-2'>Review your items before checkout.</SheetDescription>
            </SheetHeader>
            <Card className="h-full">
              <CardContent className="flex flex-col gap-2">
                <div className="text-md flex justify-between items-center mb-4 border-b pb-4 pt-4">
                  <div className="text-gray-700">
                    <span className="block">Order Number: {orderNumber}</span>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="font-semibold cursor-default">Customer Points: {customerPoints}</span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Customer Details</h4>
                            <p className="text-sm">
                              Name: {customerName}
                            </p>
                            <p className="text-sm">
                              ID: {customerId}
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex justify-between items-center">
                    <Switch
                      id="points_switch"
                      className="w-11 h-6"
                      checked={isSwitchToggled}
                      onCheckedChange={(isChecked) => {
                        setIsSwitchToggled(isChecked);
                        getTotalPointsValueForOrder();
                      }}
                    />
                    <Label className="block px-3 text-sm" htmlFor="points_switch">
                      Pay With Points
                    </Label>
                  </div>
                </div>
                <ScrollArea className="h-[300px]">
                  <ul className="divide-y divide-gray-200 pr-4">
                    {orderItems.map((item, index) => (
                      <li
                        key={index}
                        className="py-4 flex justify-between items-center"
                      >
                        <span className="text-gray-600">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button onClick={() => removeItemFromOrder(index)}>❌</button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button>
                              <Image
                                src={editOrderImage}
                                alt="Edit Order"
                                className="w-5 h-5"
                                onClick={() => setOpenedPopoverItem(item)}
                              />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            sideOffset={4}
                            className="max-w-xs"
                            onChange={(isOpen: any) =>
                              isOpen ? setOpenedPopoverItem(item) : setOpenedPopoverItem(null)
                            }
                          >
                            <div className="flex flex-col gap-2">
                              <h3 className="font-semibold">Ingredients:</h3>
                              {item.name &&
                                menuItems
                                  .find((menuItem) => menuItem.name === item.name)
                                  ?.ingredients.map((ingredient: any, index: any) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <span>{ingredient}</span>
                                      <input
                                        type="number"
                                        min="0"
                                        defaultValue={
                                          (ingredientQuantities[item.name] || {})[ingredient] || 1
                                        }
                                        onChange={(e) =>
                                          setIngredientQuantities({
                                            ...ingredientQuantities,
                                            [item.name]: {
                                              ...(ingredientQuantities[item.name] || {}),
                                              [ingredient]: parseInt(e.target.value, 10) || 0,
                                            },
                                          })
                                        }
                                        className="w-16 px-2 py-1 border border-gray-300 rounded"
                                      />
                                    </div>
                                  ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                <div className="mt-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total</span>
                    <span className="text-lg font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2 gap-2">
                  <Button
                    onClick={async () => {
                      customerSubmitOrder();
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white text-xl font-bold px-6 py-8 rounded w-full"
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={clearOrder}
                    className="bg-red-500 hover:bg-red-700 text-white text-xl font-bold px-6 py-8 rounded w-full">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SheetContent>
        </Sheet>
      </div>
      <Tabs defaultValue="Burgers&Wraps" className="w-full flex flex-row gap-2 h-full">
        <ScrollArea className="w-1/5">
          <TabsList className="grid grid-cols-1 mt-2 h-fit">
            <TabsTrigger
              value="reccs"
              className="px-8 py-9 cursor-pointer relative"
              onMouseEnter={() => setHoveredTab(7)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <h2 className="text-2xl">
                Climate Cravings
              </h2>
              {hoveredTab === 6 && (
                <div className='absolute inset-0 border-2 border-gray-300 rounded pointer-events-none transition-all duration-500'></div>
              )}
            </TabsTrigger>
            {categories.map((category, index) => (
              <TabsTrigger
                key={index}
                value={category.replace(/\s/g, '')}
                className={`px-8 py-9 cursor-pointer relative`}
                onMouseEnter={() => setHoveredTab(index)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <h2 className="text-2xl">
                  {category}
                </h2>
                {hoveredTab === index && (
                  <div className="absolute inset-0 border-2 border-gray-300 rounded pointer-events-none transition-all duration-500"></div>
                )}
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="pastOrders"
              className="px-8 py-9 cursor-pointer relative"
              onMouseEnter={() => setHoveredTab(6)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <h2 className="text-2xl">
                Past Orders
              </h2>
              {hoveredTab === 6 && (
                <div className='absolute inset-0 border-2 border-gray-300 rounded pointer-events-none transition-all duration-500'></div>
              )}
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        {categories.map((category, index) => (
          <TabsContent key={index} value={category.replace(/\s/g, '')} className="w-4/5">
            <Card className="overflow-y-scroll h-[90%]">
              <div className="grid grid-cols-5 gap-4 p-4 items-stretch">
                {menuItems
                  .filter((item) => itemBelongsToCategory(item.originalName, category))
                  .map((item: any) => {
                    return (
                      <div key={item.name}
                        className={`flex flex-col items-center gap-4 h-full transition-all duration-300 ease-in-out ${hoveredItem === item.name ? 'transform scale-105 shadow-lg rounded-lg' : ''}`}
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Card className="flex flex-col justify-between items-center h-full w-full p-4 gap-8 cursor-pointer" onClick={() => itemClicked(item)}>
                              <Image src={getImageForMenuItem(item.id)} alt={item.name} className="rounded-md" width={200} height={200} />
                              <div className="flex flex-col gap-2 text-lg text-center">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-base">${item.price.toFixed(2)}</p>
                              </div>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="w-[600px]">
                            <DialogHeader>{item.name}</DialogHeader>
                            <div className="grid gap-4 py-4"></div>
                            <div className="flex items-center justify-center gap-4">
                              {selectedItem &&
                                <Image src={getImageForMenuItem(selectedItem.id)} alt={selectedItem.name} className="rounded-md" width={300} height={300} />
                              }
                            </div>
                            <div className="flex items-center justify-start gap-4">
                              <Label htmlFor="name" className="text-right mt-0.5">
                                Ingredients:
                              </Label>
                              <div id="name" className="col-span-3">
                                {/* <ul className="flex flex-row gap-1 mr-3"> */}
                                <ul className="flex flex-row gap-1 mr-3 justify-center flex-wrap">
                                  {item.ingredients.map((ingredient: string) => (
                                    <li key={ingredient} className="text-sm">{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="flex items-center justify-start gap-4">
                              <Label htmlFor="allergens" className="text-right mt-0.5 text-red-500 font-bold ">
                                CONTAINS
                              </Label>
                              <div id="allergens" className="flex flex-row gap-4 justify-center flex-wrap">
                                {currentAllergens?.has_dairy && <p className="text-red-500">Dairy</p>}
                                {currentAllergens?.has_nuts && <p className="text-red-500">Nuts</p>}
                                {currentAllergens?.has_eggs && <p className="text-red-500">Eggs</p>}
                                {currentAllergens?.is_vegan && <p className="text-red-500">Vegan</p>}
                                {currentAllergens?.is_halal && <p className="text-red-500">Halal</p>}
                              </div>
                            </div>
                            <DialogFooter>
                              <div className="flex items-center gap-2">
                                <Label htmlFor="quantity" className="text-right text-lg">
                                  Quantity:
                                </Label>
                                <input
                                  id="quantity"
                                  type="number"
                                  min="1"
                                  value={itemQuantity}
                                  onChange={(e) => setItemQuantity(parseInt(e.target.value, 10))}
                                  className="w-16 px-2 py-1 border border-gray-300 rounded"
                                />
                              </div>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    addItemToOrder(item, itemQuantity);
                                    setItemQuantity(1); // Reset the quantity to 1 after adding to order
                                  }}
                                  className="bg-green-500 hover:bg-green-700 text-white text-xl font-bold px-6 py-8 rounded"
                                >
                                  Add to Order
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>)
                  })}
              </div>
            </Card>
          </TabsContent>
        ))
        }
        <TabsContent value='pastOrders' className='w-4/5'>
          <Card className="overflow-y-scroll h-[90%]">
            <div className="p-4 items-stretch">
              {
                typeof window !== 'undefined' && localStorage.getItem('customerId') !== null && (
                  <CustomerOrders id={localStorage.getItem('customerId')!}></CustomerOrders>
                )}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value='reccs' className='w-4/5'>
          <Card className='overflow-y-scroll h-[90%]'>
            <div className='grid grid-cols-5 gap-4 p-4 items-stretch'>
              <CustomerWeatherReccs weather={currentWeather!} items={menuItems} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CustomerView;