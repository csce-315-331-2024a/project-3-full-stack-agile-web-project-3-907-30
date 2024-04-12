import { SalesReportItem, ProductUsageItem, MostProductiveEmployeeItem } from "@/lib/types";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import SalesReport from "./sales-report";
import ProductUsage from "./product-usage";
import { Card } from "@/components/ui/card";
import MostProductiveEmployees from "./most-productive-employees";
import ExcessReport from "./excess-report";
import RestockReport from "./restock-report";

export interface TrendsProps {
  salesReportData: SalesReportItem[];
  productUsageData: ProductUsageItem[];
  mostProductiveEmployeesData: MostProductiveEmployeeItem[];
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
const Trends = ({ salesReportData, productUsageData, mostProductiveEmployeesData }: TrendsProps) => {

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
      <TabsList className="grid grid-cols-1 h-fit mt-2 w-1/5">
        {trendsTabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.replaceAll(" ", "")} className="py-4">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="SalesReport" className="w-4/5">
        <Card className="flex min-h-fit max-h-[85%]">
          <SalesReport data={salesReportData} />
        </Card>
      </TabsContent>
      <TabsContent value="ProductUsageReport" className="w-4/5">
        <Card className="flex min-h-fit max-h-[85%]">
          <ProductUsage data={productUsageData} />
        </Card>
      </TabsContent>
      <TabsContent value="ExcessReport">
        <Card className="flex min-h-fit max-h-[85%]">
          <ExcessReport />
        </Card>
      </TabsContent>
      <TabsContent value="RestockReport">
        <Card className="flex min-h-fit max-h-[85%]">
          <RestockReport />
        </Card>
      </TabsContent>
      <TabsContent value="MostProductiveEmployees" className="w-4/5">
        <Card className="flex min-h-fit max-h-[85%]">
          <MostProductiveEmployees data={mostProductiveEmployeesData} />
        </Card>
      </TabsContent>
      <TabsContent value="DayswithMostSales">
        Days with Most Sales
      </TabsContent>
      <TabsContent value="MostPopularItems">
        Most Popular Items
      </TabsContent>
      <TabsContent value="WhatSellsTogether">
        What Sells Together
      </TabsContent>
    </Tabs>
  );
};

export default Trends;
