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