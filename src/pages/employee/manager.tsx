import ViewEmployees from "@/components/manager/view-employees";
import UserManagement from "@/components/manager/user-management";
import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType, SalesReportItem, ProductUsageItem, PairsAndAppearance, PopularMenuItem, SalesForADay } from "@/lib/types";
import { getEmployeeFromDatabase, executeStatement, rowToSalesReportItem, rowToProductUsageItem, whatSellsTogether, menuItemsPopularity, daysWithMostSales } from "@/lib/utils";
import { useEffect, useState } from "react";
import SalesReport from "@/components/manager/sales-report";
import db from "@/lib/db";
import { DataTypeOIDs } from "postgresql-client";
import ProductUsage from "@/components/manager/product-usage";
import WhatSellsTogether from "@/components/manager/what-sells-together";
import DaysWithMostSales from "@/components/manager/days-with-most-sales";
import MenuItemPopularity from "@/components/manager/menu-item-popularity";



export interface ManagerProps {
  salesReportData: SalesReportItem[];
  productUsageData: ProductUsageItem[];
  // whatSellsTogetherData: PairsAndAppearance[];
  // popularMenuItemData: PopularMenuItem[];
  // salesForADayData: SalesForADay[];
}

/**
 * The manager view page. This page is only accessible to users that are managers or admins.
 * 
 * @component
 * @returns {JSX.Element} The manager view page.
 */
const Manager = ({ salesReportData, productUsageData}: ManagerProps) => {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(false);
  const [whatSellsTogetherData,setWhatSellsTogether] = useState<PairsAndAppearance[]>();
  const [popularMenuItemData, setPopularMenuItem] = useState<PopularMenuItem[]>();
  const [salesForADayData, setSalesForADay] = useState<SalesForADay[]>();

  useEffect(() => {
    const fetchTrendData = async () => {
      const whatSellsData = await whatSellsTogether("2023-01-01","2023-05-05");
      setWhatSellsTogether(whatSellsData!);

      const popularMenuItemData = await menuItemsPopularity('2023-01-03', '2023-05-01');
      setPopularMenuItem(popularMenuItemData!);

      const salesDayData = await daysWithMostSales(4,2023);
      setSalesForADay(salesDayData!);
    }

    fetchTrendData();
  }, [])

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
              {/* <SalesReport data={salesReportData} />
              <ProductUsage data={productUsageData} /> */}
              <WhatSellsTogether data={whatSellsTogetherData!} />
              <MenuItemPopularity data={popularMenuItemData!} />
              <DaysWithMostSales data={salesForADayData!} />
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
  const productUsageData = await getProductUsageData('2023-01-03', '2023-03-03');
  // const whatSellsTogetherData = await whatSellsTogether('2023-01-03', '2023-05-01');
  // const popularMenuItemData = await menuItemsPopularity('2023-01-03', '2023-05-01');
  // const salesForADayData = await daysWithMostSales(4,2023);
  return {
    props: { salesReportData, productUsageData/* popularMenuItemData, salesForADayData*/}
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

export default Manager;
