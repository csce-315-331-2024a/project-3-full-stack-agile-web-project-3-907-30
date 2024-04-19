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
import { SalesForADay } from "@/lib/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { daysWithMostSales } from "@/lib/utils";

const FormSchema = z.object({
    month: z.string(),
    year: z.string()
})

/**
 * Shows the Menu Item Popularity trend in table format.
 * 
 * @component
 * @param {SalesForADay[]} data The input data holding the result of database call.
 * @returns {JSX.Element} The Menu Item Popularity table component.
 */
const DaysWithMostSales = () => {

    const [formData, setFormData] = useState<SalesForADay[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        }
    })

    useEffect(() => {
        setLoading(false);
    }, [loading]);

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        const res = await daysWithMostSales(Number(formData.month), Number(formData.year));
        setFormData(res);
    }

    return (<>
        <Card className="min-h-fit max-h-[85%] overflow-y-scroll w-full">
            <CardHeader>
                <CardTitle>Days with Most Sales</CardTitle>
                <CardDescription>Ranks the days in a given month and year based on number of sales.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Month</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 4 (april)" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the month to be analyzed.
                                    </FormDescription>
                                </FormItem>
                            )
                            }
                        />
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 2023" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the year to be analyzed.
                                    </FormDescription>
                                </FormItem>
                            )
                            }
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
                {formData.length !== 0 && (<Table className="overflow-hidden">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sales</TableHead>
                            <TableHead>Day</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            formData.map((item: SalesForADay) => {
                                return (
                                    <TableRow key={item.row_id}>
                                        <TableCell>
                                            {item.sales}
                                        </TableCell>
                                        <TableCell>
                                            {(item.day).toString().slice(0, 10)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                    <TableFooter>

                    </TableFooter>
                </Table>)}
            </CardContent>
        </Card>
    </>);
}

export default DaysWithMostSales;