import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from '../../ui/use-toast';
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
import { getCustomerFromDatabase, updateMenuItemPrice } from '@/lib/utils';
import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
  

  
  const FormSchema = z.object({
    item_name: z.string(),
    item_price: z.string()
  })
  
  const ItemSaleGUI = () => {
  
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
      },
    })
  
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await updateMenuItemPrice(data.item_name, parseFloat(data.item_price));
    }
  
    return (
        <Card className="w-1/2 overflow-y-scroll">
            <CardHeader>
                <CardTitle>Update Item Prices</CardTitle>
                <CardDescription>Put items on sale with a few clicks.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="item_name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Bacon Cheeseburger" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the name of the menu item you want to update.
                                    </FormDescription>
                                </FormItem>
                            )
                            }
                            />
                        <FormField
                            control={form.control}
                            name="item_price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>New Price</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter the new price here" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Update the price of menu items here.
                                    </FormDescription>
                                </FormItem>
                            )
                            }
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
  };
  
  export default ItemSaleGUI;
  