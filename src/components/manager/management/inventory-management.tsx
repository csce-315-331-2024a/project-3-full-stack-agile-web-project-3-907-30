import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryItem } from '@/lib/types';
import InventoryManagementForm from './inventory-management-form';
import { useEffect, useState } from 'react';
import { getAllInventoryItems } from '@/lib/utils';
import { InventoryTable } from './inventory-table';
import { invColumns } from './inventory-columns';

const InventoryManagement = () => {
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
    <Card className="max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
        <CardDescription>Manage your inventory.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <InventoryManagementForm editMode={false} />
        <InventoryTable data={data} columns={invColumns}></InventoryTable>
      </CardContent>
    </Card >
  );
}

export default InventoryManagement;