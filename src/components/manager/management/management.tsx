import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType } from "@/lib/types";
import { getEmployeeFromDatabase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import UserManagement from "./user-management";
import ViewEmployees from "./view-employees";
import LeastSellingView from "./least-selling-view";
import LeastContributingView from "./least-contributing-view";
import ItemSaleGUI from "./item-sale-gui";
import { Card } from "@/components/ui/card";
import InventoryManagement from "./inventory-management";

/**
 * A management component that encapsulates managing users, inventory, menu, and orders.
 * 
 * @component
 * @returns {JSX.Element} The management component.
 * 
 * @example
 * // Render a management component.
 * <Management />
 */
const Management = () => {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(false);

  const managementTabs = [
    "User Management",
    "Order Management",
    "Inventory Management",
    "Menu Management",
  ];

  useEffect(() => {
    if (account) {
      setLoading(true);
      getEmployeeFromDatabase(account.email).then((data) => {
        setEmployee(data);
        setLoading(false);
      });
    }
  }, [account]);

  return (
    <Tabs defaultValue="UserManagement" className="flex flex-row gap-4 h-full">
      <TabsList className="grid grid-cols-1 h-fit mt-2 w-1/5 text-black">
        {managementTabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.replaceAll(" ", "")} className="py-4 px-8">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="UserManagement" className="w-4/5">
        <Card className="flex min-h-fit max-h-[85%] gap-8 p-4">
          {employee?.isAdmin && (
            <UserManagement />
          )}
          <ViewEmployees />
        </Card>
      </TabsContent>
      <TabsContent value="OrderManagement">
        Order Management
      </TabsContent>
      <TabsContent value="InventoryManagement" className="w-4/5">
        <InventoryManagement />
      </TabsContent>
      <TabsContent value="MenuManagement" className="w-4/5">
        <Card className="flex min-h-fit max-h-[85%] gap-8 p-4 notranslate">
          <LeastSellingView />
          <LeastContributingView />
          <ItemSaleGUI />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Management;
