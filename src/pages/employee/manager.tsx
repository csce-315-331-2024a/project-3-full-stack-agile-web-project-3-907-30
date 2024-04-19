import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType } from "@/lib/types";
import { getEmployeeFromDatabase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import Management from "@/components/manager/management/management";
import Trends from "@/components/manager/trends/trends";

/**
 * The manager view page. This page is only accessible to users that are managers or admins.
 * 
 * @component
 * @returns {JSX.Element} The manager view page.
 */
const Manager = () => {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(false);

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
    <main className="flex flex-col w-full h-full max-h-full items-start justify-start p-4 gap-4 overflow-hidden">
      {employee?.isManager ? (
        <>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <Tabs defaultValue="management" className="w-full h-full">
            <TabsList className="grid grid-cols-2 w-full h-fit">
              <TabsTrigger value="management" className="py-2">Management</TabsTrigger>
              <TabsTrigger value="trends" className="py-2">Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="management" className="h-full">
              <Management />
            </TabsContent>
            <TabsContent value="trends" className="h-full">
              <Trends />
            </TabsContent>
          </Tabs>
        </>
      ) : (loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : (
        <h1 className="text-xl">
          You are unauthorized to view this page.
        </h1>
      )
      )}
    </main>
  );
}

export default Manager;
