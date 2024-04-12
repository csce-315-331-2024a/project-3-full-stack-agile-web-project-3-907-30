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
import { ProductUsageItem } from "@/lib/types";

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