import { DetailedMenuItem, InventoryItem } from '@/lib/types';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormDescription, FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '../../ui/input'
import { Button } from '../../ui/button';
import { toast } from '../../ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import Select from 'react-select';
import { addMenuItem, deleteInventoryItem, getAllInventoryItems } from '@/lib/utils';

const FormSchema = z.object({
  item_name: z.string(),
  item_price: z.number().positive("Price must be a positive number."),
  points: z.number().int("Points must be an integer."),
  cur_price: z.number().positive("Current price must be a positive number."),
  //seasonal_item: z.boolean(),
  //deprecated: z.boolean(),
//   options: z.array(z.object({
//     value: z.number(),
//     label: z.string()
//   })),
//   ingredients: z.array(z.object({
//     inv_id: z.number(),
//     amount: z.number().positive()
//   }))
});
  


const MenuItemGUI = () => {

async function onSubmit(formData: z.infer<typeof FormSchema>) {
    const newItem: DetailedMenuItem = {
    // Fix later
    item_id: 200,
    item_name: formData.item_name,
    item_price: formData.item_price,
    times_ordered: 0,
    points: formData.points,
    cur_price: formData.cur_price,
    // Fix later if needed
    seasonal_item: false
    }
    const res = await addMenuItem(newItem);

    if (res.status === 200){
    toast({
        title: "Success!",
        description: "Menu item added.",
    });

    // reset form, let table know data has changed, close the dialog
    form.reset();
    }
    else {
    toast({
        variant: "destructive",
        title: "Error!",
        description: "There was a problem adding the item.",
    });
    }
}

const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
});


const [data, setData] = useState<InventoryItem[]>([]);
const options = data.map((item) => ({ value: item.id, label: item.name }));



useEffect(() => {
    getAllInventoryItems().then((data) => {
    setData(data);
    });
}, []);



const [showCard, setShowCard] = useState(false);
const [selected, setSelected] = useState(false);
const [isDeprecated, setIsDeprecated] = useState(false);

return (
    <Card className="w-3/5" style={{ height: '650px' }}>
    <CardHeader>
        <CardTitle>Add A Menu Item</CardTitle>
        <CardDescription>Enter the item you want to add to the menu.</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-6 overflow-y-scroll" style={{ maxHeight: '550px' }}>
        <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="item_name"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                <Input placeholder="e.g. Peppermint Milkshake" {...field} />
                </FormControl>
                <FormDescription>
                Enter the name of the menu item
                </FormDescription>
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="item_price"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Set Price</FormLabel>
                <FormControl>
                <Input placeholder="Enter the new price here" {...field} />
                </FormControl>
                <FormDescription>
                Enter the price you want to set for the seasonal item.
                </FormDescription>
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Enter Points for Item</FormLabel>
                <FormControl>
                <Input placeholder="e.g. 10" {...field} />
                </FormControl>
                <FormDescription>
                Enter how many points you want this item to have
                </FormDescription>
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="cur_price"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Enter the current price for the item</FormLabel>
                <FormControl>
                <Input placeholder="e.g. 10" {...field} />
                </FormControl>
                <FormDescription>
                Enter the price of the new item.
                </FormDescription>
            </FormItem>
            )}
        />
        <Button type="submit">Submit</Button>
        </form>
        </Form>
    </CardContent>
    </Card>
);
};
  
  export default MenuItemGUI;