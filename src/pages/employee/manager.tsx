import ViewEmployees from "@/components/manager/view-employees";
import UserManagement from "@/components/manager/user-management";
import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType, SalesReportItem } from "@/lib/types";
import { getEmployeeFromDatabase, executeStatement } from "@/lib/utils";
import { useEffect, useState } from "react";
import SalesReport from "@/components/manager/sales-report";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";

const rowToSalesReportItem = (array: any[]) => {
  return {
    id: array[0],
    name: array[1],
    profit: array[2]
  } as SalesReportItem;
}

export interface ManagerProps {
  salesReportData: SalesReportItem[]
}

/**
 * The manager view page. This page is only accessible to users that are managers or admins.
 * 
 * @component
 * @returns {JSX.Element} The manager view page.
 */
const Manager = ({ salesReportData }: ManagerProps) => {
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
    <main className="flex w-full h-full items-start justify-start p-4">
      {employee?.isManager ? (
        <section className="flex w-full gap-8">
          {employee?.isAdmin && (
            <>
              <UserManagement />
              {/* <SalesReport data={salesReportData} /> */}
            </>
          )}
          <ViewEmployees />
        </section>
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
  return {
    props: { salesReportData }
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

export default Manager;
