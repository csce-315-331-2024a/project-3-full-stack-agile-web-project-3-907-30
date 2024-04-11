import { SalesReportItem, ProductUsageItem } from "@/lib/types";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import SalesReport from "./sales-report";
import ProductUsage from "./product-usage";

export interface TrendsProps {
  salesReportData: SalesReportItem[];
  productUsageData: ProductUsageItem[];
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
const Trends = ({ salesReportData, productUsageData }: TrendsProps) => {

  const trendsTabs = [
    "Sales Report",
    "Product Usage Report",
    "Excess Report",
    "Most Productive Employees",
    "Days with Most Sales",
    "Most Popular Items",
    "What Sells Together",
  ];

  return (
    <Tabs defaultValue="SalesReport" className="flex flex-row gap-4 w-full">
      <TabsList className="grid grid-cols-1 h-fit mt-2 w-1/5">
        {trendsTabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.replaceAll(" ", "")} className="py-4">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="SalesReport" className="w-4/5">
        <SalesReport data={salesReportData} />
      </TabsContent>
      <TabsContent value="ProductUsageReport" className="w-4/5">
        <ProductUsage data={productUsageData} />
      </TabsContent>
      <TabsContent value="ExcessReport">
        Excess Report
      </TabsContent>
      <TabsContent value="MostProductiveEmployees">
        Most Productive Employees
      </TabsContent>
      <TabsContent value="DaysWithMostSales">
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
