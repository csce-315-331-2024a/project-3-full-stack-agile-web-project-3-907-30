import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { DetailedMenuItem } from '@/lib/types';
import MenuManagementForm from './menu-management-form';
import { useEffect, useState } from 'react';
import { deleteMenuItem, getAllMenuItems } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const MenuManagement = () => {
  const [data, setData] = useState<DetailedMenuItem[]>([]);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    getAllMenuItems().then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    getAllMenuItems().then((data) => {
      setData(data);
      setDataChanged((prev) => !prev);
    });
  }, [dataChanged]);

  return (
    <Card className="max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Menu Management</CardTitle>
        <CardDescription>Manage your menu.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Item Price</TableHead>
              <TableHead>Times Ordered</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Seasonal Item</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              data.map((item: DetailedMenuItem) => {
                return (
                  <TableRow key={item.item_id}>
                    <TableCell>{item.item_name}</TableCell>
                    <TableCell>${item.item_price.toFixed(2)}</TableCell>
                    <TableCell>{item.times_ordered}</TableCell>
                    <TableCell>{item.points}</TableCell>
                    <TableCell>{item.cur_price.toFixed(2)}</TableCell>
                    <TableCell>{String(item.seasonal_item)}</TableCell>
                    <TableCell className="flex gap-2">
                      <MenuManagementForm menuItem={item} editMode={true} setDataChanged={setDataChanged} />
                      <Button onClick={() => {
                        setDataChanged((prev) => !prev);
                        deleteMenuItem(item.item_id);
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

export default MenuManagement;