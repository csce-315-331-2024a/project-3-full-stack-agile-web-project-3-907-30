import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SalesReportItem } from "@/lib/types";

/**
 * A table component that displays sales report data
 * @component
 * @example
 *   <SalesReportTable data={salesData} />
 * @prop {SalesReportItem[]} data - An array of sales report items
 * @description
 *   - The component renders a table with two columns: Item Name and Profits.
 *   - The data prop is an array of objects with properties id, name, and profit.
 *   - The component calculates and displays the total profits from the data.
 *   - The data is mapped to table rows using the map function.
 */
const SalesReport = ({ data }: { data: SalesReportItem[] }) => {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Profits</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data.map((item: SalesReportItem) => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.name}
                                    </TableCell>
                                    <TableCell>
                                        ${item.profit}
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                            Total Profits:
                        </TableCell>
                        <TableCell>
                            ${data.reduce((accum, curr) => {
                                return accum + curr.profit;
                            }, 0)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    );
}

export default SalesReport;