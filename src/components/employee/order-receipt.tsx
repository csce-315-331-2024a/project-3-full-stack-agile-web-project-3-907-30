// order-receipt.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { getEmployeeFromDatabase, submitOrder } from "@/lib/utils";
import { getNextOrderId } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import useAuth from "@/hooks/useAuth";
import { AuthHookType } from "@/lib/types";
import { clear } from "console";
import { Sword } from "lucide-react";
import { set } from "zod";


import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

import { CalendarIcon } from "@radix-ui/react-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { get } from "http";

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderReceiptProps {
  items: OrderItem[];
  clearOrder: () => void;
}

/**
 * Displays an order receipt with the order details, subtotal, tax, and total cost. Allows for clearing and submitting orders.
 * @component
 * @example
 *   <OrderReceipt items={sample_items} clearOrder={clearOrder} />
 * @prop {array} items - An array of objects representing the items in the order, each with a name, price, and quantity.
 * @prop {function} clearOrder - A function to clear the current order.
 * @description
 *   - Uses a state variable to track the subtotal, tax, and total cost of the order.
 *   - Uses the useAuth and useToast hooks to retrieve the current employee's information and display toast notifications.
 *   - Uses the useEffect hook to calculate the subtotal, tax, and total cost whenever the items array changes.
 *   - Uses the employeeSubmitOrder function to submit the order with the current employee's email address and display a toast notification with the order ID.
 */
const OrderReceipt: React.FC<OrderReceiptProps> = ({ items, clearOrder }) => {
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const { account } = useAuth() as AuthHookType;
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [customerPoints, setCustomerPoints] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const { toast } = useToast();

  // Effect to calculate totals
  useEffect(() => {
    const calculateTotals = () => {
      const calculatedSubTotal = items.reduce(
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
  }, [items, isSwitchToggled, totalPoints]);

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
  const employeeSubmitOrder = async () => {
    try {
      const { email } = account!;
      const employee = await getEmployeeFromDatabase(email);
      const nextOrderId = await getNextOrderId();

      toast({
        title: "Order ID",
        description: nextOrderId,
      });

      const chosenItems = items.map((item) => item.name);
      const quantities = items.map((item) => item.quantity);
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
        parseInt(employee.empId),
        toast,
        chosenItems,
        quantities
      );
      
      let newPoints = 0;
      // if points aren't used, and order is successful, update customer points
      if (!isSwitchToggled && res && res.status === 200) {
        let updatedPoints = customerPoints ? parseInt(customerPoints, 10) - total : 0;
        // get sum of points for all items in order
        const itemNames = items
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
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
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
    const itemNames = items
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Order Receipt</CardTitle>
        <CardDescription>Review and submit your order.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
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
            <Label className="block px-3 text-lg" htmlFor="points_switch">
              Pay With Points
            </Label>
          </div>
        </div>
        <ScrollArea className="h-[200px]">
          <ul className="divide-y divide-gray-200 pr-4">
            {items.map((item, index) => (
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
        <Button
          onClick={async () => {
            employeeSubmitOrder();
          }}
          className="bg-green-500 hover:bg-green-700 text-white text-xl font-bold px-6 py-8 rounded w-full"
        >
          Submit Order
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderReceipt;
