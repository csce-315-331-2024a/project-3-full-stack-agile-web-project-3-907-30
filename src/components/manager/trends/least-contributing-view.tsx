import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeastContributing } from "@/lib/utils";
import { RevenueReportItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";


/**
 * Displays the 10 least selling items on the menu and their corresponding revenue and percentage of total revenue.
 * @component
 * @example
 *   <LeastSellingItems prop1={sample_value1} prop2={sample_value2} />
 * @prop {RevenueReportItem[]} data - An array of objects containing information about the least selling items.
 * @prop {boolean} loading - A boolean value indicating whether the data is still loading.
 * @description
 *   - Uses the useState hook to manage the component's state variables.
 *   - Uses the useEffect hook to fetch data from the server and update the state.
 *   - Renders a Card component with a Table displaying the least selling items and their corresponding revenue and percentage of total revenue.
 *   - Uses the data prop to map through the array and render a TableRow for each item.
 */
const LeastContributingView = () => {

  const [data, setData] = useState<RevenueReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeastContributing().then((data) => {
      setData(data);
    });
    setLoading(false);
  }, [loading]);

  return (
    <Card className="overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Least Contributing Items</CardTitle>
        <CardDescription>View the 5 least contributing items on the menu.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Percentage of Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              data.map((item: RevenueReportItem) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.name}
                  </TableCell>
                  <TableCell>
                    ${item.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    ${item.revenue.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {item.percentage.toFixed(2)}%
                  </TableCell>
                </TableRow>
              )
              )
            }
          </TableBody>
          <TableFooter>

          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

export default LeastContributingView;