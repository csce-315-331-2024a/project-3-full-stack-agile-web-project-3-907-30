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
import { PopularMenuItem } from "@/lib/types";

/**
 * Shows the Menu Item Popularity trend in table format.
 * 
 * @component
 * @param {PopularMenuItem[]} data The input data holding the result of database call.
 * @returns {JSX.Element} The Menu Item Popularity table component.
 */
const MenuItemPopularity = ({ data }: { data: PopularMenuItem[] }) => {
    if(!data) {
        return null;
    }

    return (<>
        <Table className="overflow-hidden">
            <TableHeader>
                <TableRow>
                    <TableHead>Sales</TableHead>
                    <TableHead>Item</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item: PopularMenuItem) => {
                        return (
                            <TableRow key={item.row_id}>
                                <TableCell>
                                    {item.num_sales}
                                </TableCell>
                                <TableCell>
                                    {item.item}
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

export default MenuItemPopularity;