import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType } from "@/lib/types";
import { getEmployeeFromDatabase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import UserManagement from "./user-management";
import ViewEmployees from "./view-employees";

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
    <Tabs defaultValue="account" className="flex flex-row gap-4">
      <TabsList className="grid grid-cols-1 h-fit mt-2">
        {managementTabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.replace(" ", "")} className="py-4">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="UserManagement">
        <section className="flex gap-8">
          {employee?.isAdmin && (
            <UserManagement />
          )}
          <ViewEmployees />
        </section>
      </TabsContent>
      <TabsContent value="OrderManagement">
        Order Management
      </TabsContent>
      <TabsContent value="InventoryManagement">
        Inventory Management
      </TabsContent>
      <TabsContent value="MenuManagement">
        Menu Management
      </TabsContent>
    </Tabs>
  );
};

export default Management;
