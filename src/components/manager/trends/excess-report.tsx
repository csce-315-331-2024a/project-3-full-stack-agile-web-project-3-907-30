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
import { getExcessReport } from "@/lib/utils";
import { ExcessReportItem } from "@/lib/types";



const ExcessReport = () => {

    const [data, setData] = useState<ExcessReportItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getExcessReport().then((data) => {
        setData(data);
        });
        setLoading(false);
    }, [loading]);

    return (<>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Initial Amount</TableHead>
                    <TableHead>Percent Used</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item: ExcessReportItem) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.name}
                                </TableCell>
                                <TableCell>
                                    {item.initial_amount}
                                </TableCell>
                                <TableCell>
                                    {item.percent_used}
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

export default ExcessReport;