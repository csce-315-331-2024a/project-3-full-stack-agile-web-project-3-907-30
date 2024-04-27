import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import SalesReport from "./sales-report";
import ProductUsage from "./product-usage";
import { Card } from "@/components/ui/card";
import MostProductiveEmployees from "./most-productive-employees";
import ExcessReport from "./excess-report";
import RestockReport from "./restock-report";
import WhatSellsTogether from "./what-sells-together";
import MenuItemPopularity from "./menu-item-popularity";
import DaysWithMostSales from "./days-with-most-sales";
import LeastSellingView from "./least-selling-view";
import LeastContributingView from "./least-contributing-view";

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
const Trends = () => {

  const trendsTabs = [
    "Sales Report",
    "Product Usage Report",
    "Excess Report",
    "Restock Report",
    "Most Productive Employees",
    "Days with Most Sales",
    "Most Popular Items",
    "What Sells Together",
    "Least Selling View",
    "Least Contributing View"
  ];

  return (
    <Tabs defaultValue="SalesReport" className="flex flex-row gap-4 w-full h-full">
      <TabsList className="grid grid-cols-1 h-fit mt-2 w-1/5">
        {trendsTabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.replaceAll(" ", "")} className="py-4 px-8">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="SalesReport" className="w-4/5">
        <SalesReport />
      </TabsContent>
      <TabsContent value="ProductUsageReport" className="w-4/5">
        <ProductUsage />
        {/* <DatePicker /> */}
      </TabsContent>
      <TabsContent value="ExcessReport" className="w-4/5">
        <ExcessReport />
      </TabsContent>
      <TabsContent value="RestockReport" className="w-4/5">
        <Card className="flex max-h-[85%]">
          <RestockReport />
        </Card>
      </TabsContent>
      <TabsContent value="MostProductiveEmployees" className="w-4/5">
        <MostProductiveEmployees />
      </TabsContent>
      <TabsContent value="WhatSellsTogether" className="w-4/5">
        <Card className="flex max-h-[85%]">
          <WhatSellsTogether />
        </Card>
      </TabsContent>
      <TabsContent value="MostPopularItems" className="w-4/5">
        <Card className="flex max-h-[85%]">
          <MenuItemPopularity />
        </Card>
      </TabsContent>
      <TabsContent value="DayswithMostSales" className="w-4/5">
        <Card className="flex max-h-[85%]">
          <DaysWithMostSales />
        </Card>
      </TabsContent>
      <TabsContent value="LeastSellingView" className="w-4/5">
        <Card className="flex max-h-[85%]">
          <LeastSellingView />
        </Card>
      </TabsContent>
      <TabsContent value="LeastContributingView" className="w-4/5">
        <Card className="flex max-h-[85%]">
          <LeastContributingView />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Trends;
