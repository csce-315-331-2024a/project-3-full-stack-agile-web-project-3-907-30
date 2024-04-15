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
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { getProductUsageReportInRange } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '../../ui/form';
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from '../../ui/button';

const FormSchema = z.object({
    start_date: z.string(),
    end_date: z.string()
})


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
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        },
    })

    var [formData, setFormData] = useState<ProductUsageItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setFormData(data);
        setLoading(false);
    }, [loading]);

    useEffect(() => {
    }, [onSubmit]);

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        const res = await getProductUsageReportInRange(formData.start_date, formData.end_date);
        setFormData(res);
    }

    return (
        <Card className="min-h-fit max-h-[85%] overflow-y-scroll w-full">
            <CardHeader>
                <CardTitle>Product Usage Report</CardTitle>
                <CardDescription>View items that have been used within a certain date range.</CardDescription>
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
                            )
                            }
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
                <Table className="overflow-hidden">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            formData.map((item: ProductUsageItem) => {
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
            </CardContent>
        </Card>
    );
}

export default ProductUsage;