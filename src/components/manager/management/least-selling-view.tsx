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

/**
 * Displays the 10 least selling items on the menu in a table format.
 * @component
 * @example
 *   <LeastSellingItems prop1={sample_value1} prop2={sample_value2} />
 * @prop {MenuItem[]} data - An array of menu items with their corresponding data.
 * @prop {boolean} loading - A boolean indicating whether the data is still loading or not.
 * @description
 *   - Uses the useState hook to manage the data and loading state variables.
 *   - Uses the useEffect hook to fetch the data from the server and update the state variables.
 *   - Renders a Card component with a title and description.
 *   - Renders a Table component with a header, body, and footer.
 */
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