import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { ProductUsageItem } from "@/lib/types";

/**
 * Displays a table of product usage items with their corresponding names and amounts.
 * @component
 * @example
 *   <ProductUsageTable data={[{id: 1, name: "Product A", amount: 10}, {id: 2, name: "Product B", amount: 5}]} />
 * @prop {ProductUsageItem[]} data - An array of objects containing information about each product usage item.
 * @description
 *   - Uses the Table, TableHeader, TableBody, TableRow, TableCell, and TableFooter components from Material UI.
 *   - Uses the map function to iterate through the data array and display each product usage item in a TableRow.
 *   - Uses the key prop to assign a unique key to each TableRow.
 *   - The data prop should be an array of objects with the following shape: {id: number, name: string, amount: number}.
 */
const ProductUsage = ({ data }: { data: ProductUsageItem[] }) => {
    return (<>
        <Table className="overflow-hidden">
            <TableHeader>
                <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item: ProductUsageItem) => {
                        return (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.name}
                                </TableCell>
                                <TableCell>
                                    {item.amount}
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

export default ProductUsage;