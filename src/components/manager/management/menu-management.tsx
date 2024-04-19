import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { MenuItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const MenuManagement = () => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    getAllInventoryItems().then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    getAllInventoryItems().then((data) => {
      setData(data);
      setDataChanged((prev) => !prev);
    });
  }, [dataChanged]);

  return (
    <Card className="min-h-fit max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
        <CardDescription>Manage your inventory.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <InventoryManagementForm editMode={false} setDataChanged={setDataChanged} />
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Fill Level</TableHead>
              <TableHead>Current Level</TableHead>
              <TableHead>Times Refilled</TableHead>
              <TableHead>Date Refilled</TableHead>
              <TableHead>Dairy?</TableHead>
              <TableHead>Nuts?</TableHead>
              <TableHead>Eggs?</TableHead>
              <TableHead>Vegan?</TableHead>
              <TableHead>Halal?</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              data.map((item: InventoryItem) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.fill_level}</TableCell>
                    <TableCell>{item.curr_level}</TableCell>
                    <TableCell>{item.times_refilled}</TableCell>
                    <TableCell>{new Date(item.date_refilled).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>{String(item.has_dairy)}</TableCell>
                    <TableCell>{String(item.has_nuts)}</TableCell>
                    <TableCell>{String(item.has_eggs)}</TableCell>
                    <TableCell>{String(item.is_vegan)}</TableCell>
                    <TableCell>{String(item.is_halal)}</TableCell>
                    <TableCell className="flex gap-2">
                      <InventoryManagementForm inventoryItem={item} editMode={true} setDataChanged={setDataChanged} />
                      <Button onClick={() => {
                        setDataChanged((prev) => !prev);
                        deleteInventoryItem(item.id);
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

export default InventoryManagement;