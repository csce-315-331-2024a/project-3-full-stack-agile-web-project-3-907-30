import { useEffect, useState } from "react";
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
import { getLeastSelling } from "@/lib/utils";
import { MenuItem } from "@/lib/types";



const LeastSellingView = () => {

    const [data, setData] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeastSelling().then((data) => {
        setData(data);
        });
        setLoading(false);
    }, [loading]);

    return (<>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Amount Ordered</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item: MenuItem) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.name}
                                </TableCell>
                                <TableCell>
                                    {item.times_ordered}
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

export default LeastSellingView;