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
import { SalesForADay } from "@/lib/types";

/**
 * Shows the Menu Item Popularity trend in table format.
 * 
 * @component
 * @param {SalesForADay[]} data The input data holding the result of database call.
 * @returns {JSX.Element} The Menu Item Popularity table component.
 */
const DaysWithMostSales = ({ data }: { data: SalesForADay[] }) => {
    if(!data) {
        return null;
    }

    return (<>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Sales</TableHead>
                    <TableHead>Day</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item: SalesForADay) => {
                        return (
                            <TableRow key={item.sales}>
                                <TableCell>
                                    {item.sales}
                                </TableCell>
                                <TableCell>
                                    {(item.day).toString().slice(0,10)}
                                </TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
            <TableFooter>

            </TableFooter>
        </Table>

    </>);
}

export default DaysWithMostSales;