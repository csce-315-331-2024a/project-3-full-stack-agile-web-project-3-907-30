import { SalesReportItem, ProductUsageItem, MostProductiveEmployeeItem, PairsAndAppearance, PopularMenuItem, SalesForADay } from "@/lib/types";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import SalesReport from "./sales-report";
import ProductUsage from "./product-usage";
import { Card } from "@/components/ui/card";
import MostProductiveEmployees from "./most-productive-employees";
import ExcessReport from "./excess-report";
import RestockReport from "./restock-report";
import DatePicker from "./date-picker";
import WhatSellsTogether from "./what-sells-together";
import MenuItemPopularity from "./menu-item-popularity";
import DaysWithMostSales from "./days-with-most-sales";

export interface TrendsProps {
  salesReportData: SalesReportItem[];
  productUsageData: ProductUsageItem[];
  mostProductiveEmployeesData: MostProductiveEmployeeItem[];
  whatSellsTogetherData: PairsAndAppearance[];
  popularMenuItemData: PopularMenuItem[];
  salesForADayData: SalesForADay[];
}

/**
 * A trends component that encapsulates all trend reports.
 * 
 * @component
 * @returns {JSX.Element} The trends component.
 * 
 * @example
 * // Render a trends component.
 * <Trends />
 */
const Trends = ({ salesReportData, productUsageData, mostProductiveEmployeesData, whatSellsTogetherData, popularMenuItemData,
  salesForADayData
}: TrendsProps) => {

  const trendsTabs = [
    "Sales Report",
    "Product Usage Report",
    "Excess Report",
    "Restock Report",
    "Most Productive Employees",
    "Days with Most Sales",
    "Most Popular Items",
    "What Sells Together",
  ];

  return (
    <Tabs defaultValue="SalesReport" className="flex flex-row gap-4 w-full h-full">
      <TabsList className="grid grid-cols-1 h-fit mt-2 w-fit">
        {trendsTabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.replaceAll(" ", "")} className="py-4 px-8">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="SalesReport" className="w-full">
        <SalesReport data={salesReportData} />
      </TabsContent>
      <TabsContent value="ProductUsageReport" className="w-full">
        <ProductUsage data={productUsageData} />
        {/* <DatePicker /> */}
      </TabsContent>
      <TabsContent value="ExcessReport" className="w-full">
        <ExcessReport />
      </TabsContent>
      <TabsContent value="RestockReport" className="w-full">
        <Card className="flex min-h-fit max-h-[85%]">
          <RestockReport />
        </Card>
      </TabsContent>
      <TabsContent value="MostProductiveEmployees" className="w-full">
        <MostProductiveEmployees data={mostProductiveEmployeesData} />
      </TabsContent>
      <TabsContent value="WhatSellsTogether" className="w-full">
        <Card className="flex min-h-fit max-h-[85%]">
          <WhatSellsTogether data={whatSellsTogetherData} />
        </Card>
      </TabsContent>
      <TabsContent value="MostPopularItems" className="w-full">
        <Card className="flex min-h-fit max-h-[85%]">
          <MenuItemPopularity data={popularMenuItemData} />
        </Card>
      </TabsContent>
      <TabsContent value="DayswithMostSales" className="w-full">
        <Card className="flex min-h-fit max-h-[85%]">
          <DaysWithMostSales data={salesForADayData} />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Trends;
