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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input'
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { getSalesReportInRange } from "@/lib/utils";

const FormSchema = z.object({
    start_date: z.string(),
    end_date: z.string()
})

/**
 * A table component that displays sales report data
 * @component
 * @example
 *   <SalesReportTable data={salesData} />
 * @prop {SalesReportItem[]} data - An array of sales report items
 * @description
 *   - The component renders a table with two columns: Item Name and Profits.
 *   - The data prop is an array of objects with properties id, name, and profit.
 *   - The component calculates and displays the total profits from the data.
 *   - The data is mapped to table rows using the map function.
 */
const SalesReport = ({ data }: { data: SalesReportItem[] }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        },
    })

    var [formData, setFormData] = useState<SalesReportItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setFormData(data);
        setLoading(false);
    }, [loading]);

    useEffect(() => {
    }, [onSubmit]);

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        const res = await getSalesReportInRange(formData.start_date, formData.end_date);
        setFormData(res);
    }

    return (
        <Card className="min-h-fit max-h-[85%] overflow-y-scroll w-full">
            <CardHeader>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>View profits from sales within a specific date range.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 2022-01-01" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the start date of the interval you want to see.
                                    </FormDescription>
                                </FormItem>
                            )
                            }
                        />
                        <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 2023-01-01" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the end date of the interval you want to see.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Profits</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            formData.map((item: SalesReportItem) => {
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
                                ${formData.reduce((accum, curr) => {
                                    return accum + curr.profit;
                                }, 0).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
}

export default SalesReport;