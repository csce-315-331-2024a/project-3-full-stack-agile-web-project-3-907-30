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
import DatePicker from '../trends/date-picker';

const FormSchema = z.object({
    item_name: z.string(),
    item_price: z.number(),
    start_date: z.string(),
    end_date: z.string(),
  });
  
  const SeasonalGUI = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {},
    });


    const [showCard, setShowCard] = useState(false);
  
    return (
      <Card className="w-1/2 overflow-y-scroll" style={{ height: '650px' }}>
        <CardHeader>
          <CardTitle>Add A Seasonal Item</CardTitle>
          <CardDescription>Enter the seasonal item you want to add to the menu.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Form {...form}>
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
                    Enter the name of the seasonal menu item
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
              )}
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
            <Button type="button" onClick={() => setShowCard(true)}>Add Ingredients</Button>
            {showCard && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Ingredients to New Menu Item</CardTitle>
                  <CardDescription>Select ingredients</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
              </Card>
            )}
            <Button type="submit">Submit</Button>
          </Form>
        </CardContent>
      </Card>
    );
  };
  
  export default SeasonalGUI;