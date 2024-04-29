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
import { getRestockReport } from "@/lib/utils";
import { RestockReportItem } from "@/lib/types";

/**
 * Shows the Restock Report trend in table format.
 * 
 * @component
 * @param {RestockReportItem[]} data The input data holding the result of database call.
 * @returns {JSX.Element} The Restock Report Item table component.
 */

const RestockReport = () => {
  const [data, setData] = useState<RestockReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestockReport().then((data) => {
      setData(data);
    });
    setLoading(false);
  }, [loading]);

  return (<>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Current Level</TableHead>
          <TableHead>Fill Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          data.map((item: RestockReportItem) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.name}
              </TableCell>
              <TableCell>
                {item.current_level}
              </TableCell>
              <TableCell>
                {item.fill_level}
              </TableCell>
            </TableRow>
          )
          )
        }
      </TableBody>
      <TableFooter>

      </TableFooter>
    </Table>

  </>);
}

export default RestockReport;