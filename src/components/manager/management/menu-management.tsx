import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { DetailedMenuItem } from '@/lib/types';

import { useEffect, useState } from 'react';
import { deleteMenuItem, getAllMenuItems } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MenuTable } from './menu-table';
import { MenuIcon } from 'lucide-react';
import { menuColumns } from './menu-columns';

/**
 * 
 * @param {MenuManagementForm form} The form which allows managers to send data to be updated to the database 
 * @returns {JSX.Element} The MenuManagement component.
 * @example
 *  <MenuManagement />
 * @description
 * This component allows the manager to view and update menu items.
 * The manager can update the name, price, times_ordered, points, current price, seasonal item status, deprecated status, and ingredients
 * Uses the Data Table from Shad CN UI as well as the menu-management-form component to provide this functionality.
 */

const MenuManagement = () => {
  const [data, setData] = useState<DetailedMenuItem[]>([]);

  useEffect(() => {
    getAllMenuItems().then((data) => {
      setData(data);
      console.log(data);
    });
  }, []);

  return (
    <Card className="max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Menu Management</CardTitle>
        <CardDescription>Manage your menu.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <MenuTable columns={menuColumns} data={data} />
      </CardContent>
    </Card>
  );
}

export default MenuManagement;