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
import { PopularMenuItem } from "@/lib/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { menuItemsPopularity } from "@/lib/utils";

const FormSchema = z.object({
    start_date: z.string(),
    end_date: z.string()
})

/**
 * Shows the Menu Item Popularity trend in table format.
 * 
 * @component
 * @param {PopularMenuItem[]} data The input data holding the result of database call.
 * @returns {JSX.Element} The Menu Item Popularity table component.
 */
const MenuItemPopularity = ({ data }: { data: PopularMenuItem[] }) => {

    const [formData, setFormData] = useState<PopularMenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        }
    })

    useEffect(() => {
        setFormData(data);
        setLoading(false);
    }, [loading]);
    
    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        const res = await menuItemsPopularity(formData.start_date, formData.end_date);
        setFormData(res);
    }

    if(!data) {
        return null;
    }

    return (<>
        <Card className="min-h-fit max-h-[85%] overflow-y-scroll w-full">
            <CardHeader>
                <CardTitle>Menu Item Popularity</CardTitle>
                <CardDescription>See the top 10 items that sold the most in a given date range.</CardDescription>
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
                            <TableHead>Sales</TableHead>
                            <TableHead>Item</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            formData.map((item: PopularMenuItem) => {
                                return (
                                    <TableRow key={item.row_id}>
                                        <TableCell>
                                            {item.num_sales}
                                        </TableCell>
                                        <TableCell>
                                            {item.item}
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
    </>);
}

export default MenuItemPopularity;