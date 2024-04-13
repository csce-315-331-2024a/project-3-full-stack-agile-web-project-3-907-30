import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType, SalesReportItem, ProductUsageItem, MostProductiveEmployeeItem } from "@/lib/types";
import { getEmployeeFromDatabase, executeStatement, rowToSalesReportItem, rowToProductUsageItem, rowToMostProductiveEmployeeItem } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import Management from "@/components/manager/management/management";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";
import Trends from "@/components/manager/trends/trends";
import { Button } from "@/components/ui/button";



export interface ManagerProps {
  salesReportData: SalesReportItem[];
  productUsageData: ProductUsageItem[];
  mostProductiveEmployeesData: MostProductiveEmployeeItem[];
}

/**
 * The manager view page. This page is only accessible to users that are managers or admins.
 * 
 * @component
 * @returns {JSX.Element} The manager view page.
 */
const Manager = ({ salesReportData, productUsageData, mostProductiveEmployeesData }: ManagerProps) => {
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
          <Tabs defaultValue="overview" className="w-full h-full">
            <TabsList className="grid grid-cols-2 w-full h-fit">
              <TabsTrigger value="management" className="py-2">Management</TabsTrigger>
              <TabsTrigger value="trends" className="py-2">Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="management" className="h-full">
              <Management />
            </TabsContent>
            <TabsContent value="trends" className="h-full">
              <Trends salesReportData={salesReportData} productUsageData={productUsageData} mostProductiveEmployeesData={mostProductiveEmployeesData} />
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

export const getServerSideProps = async () => {
  const salesReportData = await getSalesReportData('2023-01-03', '2023-03-03');
  const productUsageData = await getProductUsageData('2023-01-03', '2023-03-03');
  const mostProductiveEmployeesData = await getMostProductiveEmployees();
  return {
    props: { salesReportData, productUsageData, mostProductiveEmployeesData },
  };
}

const getSalesReportData = async (begin: string, end: string) => {
  const rows = await executeStatement(
    db,
    `SELECT menu_items.item_id, menu_items.item_name, COUNT(*)*menu_items.item_price::numeric as profit
                    FROM menu_items
                    INNER JOIN orders_menu ON menu_items.item_id = orders_menu.item_id
                    INNER JOIN orders ON orders_menu.order_id = orders.order_id
                    WHERE orders.order_date BETWEEN $1 AND $2
                    GROUP BY menu_items.item_id;`,
    [DataTypeOIDs.date, DataTypeOIDs.date],
    [begin, end]
  ).then(data => data.rows!);

  return rows.map(row => rowToSalesReportItem(row));
}

const getProductUsageData = async (begin: string, end: string) => {
  const rows = await executeStatement(
    db,
    `SELECT inventory.inv_id, inventory.inv_name, COALESCE(SUM(inv_menu.amount), 0) as amount FROM inventory
                    INNER JOIN inv_menu ON inv_menu.inv_id = inventory.inv_id
                    INNER JOIN menu_items on menu_items.item_id = inv_menu.item_id
                    INNER JOIN orders_menu ON orders_menu.item_id = menu_items.item_id
                    INNER JOIN orders ON orders.order_id = orders_menu.order_id
                    WHERE orders.order_date BETWEEN $1 AND $2
                    GROUP BY inventory.inv_id;`,
    [DataTypeOIDs.date, DataTypeOIDs.date],
    [begin, end]
  ).then(data => data.rows!);

  return rows.map(row => rowToProductUsageItem(row));

}

const getMostProductiveEmployees = async () => {
  const rows = await executeStatement(
    db,
    `SELECT emp_id, emp_name, total_orders
    FROM Employees WHERE total_orders > 0 
    ORDER BY total_orders DESC;`,
    [],
    []
  ).then(data => data.rows!);

  return rows.map(row => rowToMostProductiveEmployeeItem(row));
}

export default Manager;
