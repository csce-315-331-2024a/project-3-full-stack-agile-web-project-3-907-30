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
import { PairsAndAppearance } from "@/lib/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";

const FormSchema = z.object({
    start_date: z.string(),
    end_date: z.string()
  })

/**
 * Shows the What Sells Together trend in table format.
 * 
 * @component
 * @param {PairsAndAppearance[]} data The input data holding the result of database call.
 * @returns {JSX.Element} The What Sells Together table component.
 */
const WhatSellsTogether = ({ data }: { data: PairsAndAppearance[] }) => {

    const [formData, setFormData] = useState<PairsAndAppearance[]>([]);
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
    

    if(!data) {
        return null;
    }

    return (<>
    <Card>
        <CardContent>
        <CardHeader>
            <CardTitle>What Sells Together</CardTitle>
            <CardDescription>See which item pairs sold the most in a given date range</CardDescription>
        </CardHeader>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Sales</TableHead>
                    <TableHead>Item 1</TableHead>
                    <TableHead>Item 2</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item: PairsAndAppearance) => {
                        return (
                            <TableRow key={item.row_id}>
                                <TableCell>
                                    {item.appearances}
                                </TableCell>
                                <TableCell>
                                    {item.item1}   
                                </TableCell>
                                <TableCell>
                                    {item.item2}
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

export default WhatSellsTogether;