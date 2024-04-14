import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from '../../ui/use-toast';
import { Input } from '../../ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
import { getCustomerFromDatabase } from '@/lib/utils';
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
        console.log("Hello World");
        console.log( data.item_name );
    }
  
    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="item_name"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Enter Item Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter name of the menu item" {...field} />
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
                        <FormLabel>Update Price</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter new price here broken" {...field} />
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
    );
  };
  
  export default ItemSaleGUI;
  