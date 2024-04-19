import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { OrderItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getAllOrders } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const OrderManagement = () => {
  const [data, setData] = useState<OrderItem[]>([]);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    getAllOrders().then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    getAllOrders().then((data) => {
      setData(data);
      setDataChanged((prev) => !prev);
    });
  }, [dataChanged]);

  return (
    <Card className="min-h-fit max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>Manage your past orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Time</TableHead>
              <TableHead>Order Total</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Used Points?</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              data.map((item: OrderItem) => {
                return (
                  <TableRow key={item.order_id}>
                    <TableCell>{item.order_id}</TableCell>
                    <TableCell>{new Date(item.order_date).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>{item.order_time}</TableCell>
                    <TableCell>${item.order_total.toFixed(2)}</TableCell>
                    <TableCell>{item.cust_id}</TableCell>
                    <TableCell>{item.emp_id}</TableCell>
                    <TableCell>{String(item.used_points)}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    {/* <TableCell className="flex gap-2">
                      <OrderManagementForm orderItem={item} setDataChanged={setDataChanged} />
                      <Button onClick={() => {
                        setDataChanged((prev) => !prev);
                        deleteInventoryItem(item.id);
                      }}>X</Button>
                    </TableCell> */}
                  </TableRow>
                )
              })
            }
          </TableBody>
          <TableFooter>

          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

export default OrderManagement;