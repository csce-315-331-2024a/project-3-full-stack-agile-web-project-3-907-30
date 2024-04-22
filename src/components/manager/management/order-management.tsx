import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { OrderItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import { cn, deleteOrder, getAllOrders } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import OrderManagementForm from './order-management-form';

const OrderManagement = ({ numOrders }: { numOrders: number }) => {
  const [data, setData] = useState<OrderItem[]>([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [open, setOpen] = useState(false);

  const pages = Array.from({ length: Math.floor(numOrders / 100) + 1 }, (_, i) => (
    { label: `Page ${i + 1}`, value: i }
  ));

  useEffect(() => {
    getAllOrders(0).then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    getAllOrders(currentPage).then((data) => {
      setData(data);
      setDataChanged((prev) => !prev);
    });
  }, [dataChanged, currentPage]);

  const statusNumberToString = (status: number) => {
    switch (status) {
      case -1:
        return "Cancelled";
      case 0:
        return "Pending";
      case 1:
        return "Fulfilled";
      default:
        return "Unknown";
    }
  }

  return (
    <Card className="max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>Manage your past orders.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {currentPage !== null
                ? pages.find((page) => page.value === currentPage)?.label
                : "Select page..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search pages..." />
              <CommandList>
                <CommandEmpty>No pages found.</CommandEmpty>
                <CommandGroup>
                  {pages.map((page) => (
                    <CommandItem
                      key={page.value}
                      value={page.value.toString()}
                      onSelect={(currentValue) => {
                        console.log(currentValue)
                        setCurrentPage(Number(currentValue) === currentPage ? 0 : Number(currentValue))
                        setOpen(false)
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentPage === page.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {page.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
              <TableHead>Actions</TableHead>
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
                    <TableCell>{statusNumberToString(item.status)}</TableCell>
                    <TableCell className="flex gap-2">
                      <OrderManagementForm orderItem={item} setDataChanged={setDataChanged} />
                      <Button onClick={() => {
                        setDataChanged((prev) => !prev);
                        deleteOrder(item.order_id);
                      }}>X</Button>
                    </TableCell>
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