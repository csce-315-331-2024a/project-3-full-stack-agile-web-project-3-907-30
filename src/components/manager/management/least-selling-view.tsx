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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

const LeastSellingView = () => {

    const [data, setData] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeastSelling().then((data) => {
        setData(data);
        });
        setLoading(false);
    }, [loading]);

    return (

        <Card className="w-1/2 overflow-y-scroll">
            <CardHeader>
                <CardTitle>Least Selling Items</CardTitle>
                <CardDescription>View the 10 least selling items on the menu.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
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
            </CardContent>
        </Card>
);
}

export default LeastSellingView;