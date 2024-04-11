import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType } from "@/lib/types";
import { getEmployeeFromDatabase } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import Management from "@/components/manager/management/management";

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
    <main className="flex flex-col w-full h-full items-start justify-start p-4 gap-4">

      {employee?.isManager ? (
        <>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <Tabs defaultValue="account">
            <TabsList className="grid w-fit grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Overview</TabsContent>
            <TabsContent value="trends">Trends</TabsContent>
            <TabsContent value="management">
              <Management />
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
