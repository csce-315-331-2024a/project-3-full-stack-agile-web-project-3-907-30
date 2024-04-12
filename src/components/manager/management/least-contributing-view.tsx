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
import { getLeastContributing } from "@/lib/utils";
import { RevenueReportItem } from "@/lib/types";



const LeastContributingView = () => {

    const [data, setData] = useState<RevenueReportItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeastContributing().then((data) => {
        setData(data);
        });
        setLoading(false);
    }, [loading]);

    return (<>
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
                                    {item.price}
                                </TableCell>
                                <TableCell>
                                    {item.revenue}
                                </TableCell>
                                <TableCell>
                                    {item.percentage}
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

export default LeastContributingView;