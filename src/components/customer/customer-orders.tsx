import { CustomerOrder } from "@/lib/types";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";

/**
 * @typedef {CustomerOrdersProps} CustomerOrderProps
 * @prop {string} id Associated customer's ID number.
 */
interface CustomerOrdersProps {
  id: string;
}

/**
 * A component to render the past orders of an associated customer.
 * 
 * @component
 * @param {CustomerOrdersProps} props - The component accepts a valid customer ID as props
 * @returns {JSX.Element} The rendered table component.
 * 
 * @example 
 * // Render the past orders of the customer with an associated ID of 1
 * <CustomerOrders id={1} />
 */
const CustomerOrders = ({ id }: CustomerOrdersProps) => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  /**
   * Function to get and set the associated orders of the customer.
   * 
   */
  const getAndSetCustomerOrders = async (): Promise<void> => {
    const data = await fetch(`/api/customer/get-purchases?custId=${id}`).then(async (res) => {
      return await res.json().then((data) => {
        if (data.error !== undefined) {
          return null;
        } else {
          return data;
        }
      })
    });

    console.log(data);
    if (data === null) {
      setOrders([]);
    } else {
      setOrders(data);
    }
  }

  useEffect(() => {
    getAndSetCustomerOrders();
  })

  return (
    <>
      <ScrollArea>
        {orders.length === 0 && (
          <h1>You have no associated order history.</h1>
        )}
        {orders.length !== 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Ordered</TableHead>
                <TableHead>Order Total</TableHead>
                <TableHead>Points Used?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                return (
                  <TableRow key={order.order_id}>
                    <TableCell>{order.order_date.toString().substring(0, 10)}</TableCell>
                    <TableCell>{order.order_total}</TableCell>
                    <TableCell>{order.used_points ? '✅' : '❌'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </ScrollArea>
    </>
  )
}

export default CustomerOrders;