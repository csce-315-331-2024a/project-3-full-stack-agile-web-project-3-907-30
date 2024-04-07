import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { getEmployeeFromDatabase, submitOrder } from "@/lib/utils";
import { getNextOrderId } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import useAuth from "@/hooks/useAuth";
import { AuthHookType } from "@/lib/types";


export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderReceiptProps {
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

  const { toast } = useToast();


  // Effect to calculate totals
  useEffect(() => {
    const calculatedSubTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const calculatedTax = calculatedSubTotal * 0.07; // Assuming a tax rate of 7%
    const calculatedTotal = calculatedSubTotal + calculatedTax;

    setSubTotal(calculatedSubTotal);
    setTax(calculatedTax);
    setTotal(calculatedTotal);
  }, [items]); // Dependency array ensures calculateTotals is called when items change




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

    const { email } = account!;
    const employee = await getEmployeeFromDatabase(email);
    const nextOrderId = await getNextOrderId();

    toast({
      title: 'Order ID',
      description: nextOrderId,
    });

    const chosenItems = items.map((item) => item.name);
    const quantities = items.map((item) => item.quantity);
    const res = await submitOrder(nextOrderId, total, 1, parseInt(employee.empId), toast, chosenItems, quantities);

    if (res) {
      if (res.status === 200) {
        toast({
          title: 'Success!',
          description: 'Your order has been placed!',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    }
  }

  return (
    <Card className="h-[624px]">
      <CardHeader>
        <CardTitle>Order Receipt</CardTitle>
        <CardDescription>Review and submit your order.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 border-b pb-4">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <div className="text-gray-700">
            <span className="block">Order Number: </span> {/* Placeholder number */}
          </div>
        </div>
        <ScrollArea className="h-[150px]">
          <ul className="divide-y divide-gray-200 pr-4">
            {items.map((item, index) => (
              <li key={index} className="py-4 flex justify-between items-center">
                <span className="text-gray-600">{item.name} x {item.quantity}</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
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
        <div className="flex justify-center w-full mt-6 gap-2">
          <Button onClick={clearOrder} className="bg-red-500 hover:bg-red-700 text-white text-lg font-bold p-6 rounded w-1/2">
            Clear Order
          </Button>
          <Button onClick={async () => {
            employeeSubmitOrder();
          }} className="bg-green-500 hover:bg-green-700 text-white text-lg font-bold p-6 rounded w-1/2">
            Submit Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderReceipt;
