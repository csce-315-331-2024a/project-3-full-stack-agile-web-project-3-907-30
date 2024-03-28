import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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




  const employeeSubmitOrder = async () => {

    const { email } = account!;
    const employee = await getEmployeeFromDatabase(email);
    const nextOrderId = await getNextOrderId();

    toast({
      title: 'Order ID',
      description: nextOrderId,
    });

    const res = await submitOrder(nextOrderId, total, 1, parseInt(employee.empId), toast);

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
        <CardTitle className="text-center">Order Receipt</CardTitle>
        <Button onClick={clearOrder} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Clear Order
        </Button>
      </CardHeader>
      <CardContent className="p-4">
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
        <div className="flex justify-end mt-6">
          <Button onClick={async () => {
            employeeSubmitOrder();
          }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Submit Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderReceipt;
