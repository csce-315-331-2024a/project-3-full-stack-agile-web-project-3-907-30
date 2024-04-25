import { DetailedMenuItem, InventoryItem } from '@/lib/types';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
  item_price: z.string(),
  points: z.string(),
  ingredients: z.array(z.string())
});
  


const SeasonalGUI = () => {

async function onSubmit(formData: z.infer<typeof FormSchema>) {
    console.log("Hello World");
    
    const newItem: DetailedMenuItem = {
    // Fix later
    item_id: 200,
    item_name: formData.item_name,
    item_price: parseFloat(formData.item_price),
    times_ordered: 0,
    points: parseInt(formData.points),
    // make cur_price = item_price
    cur_price: parseFloat(formData.item_price),
    // Fix later if needed
    seasonal_item: false,
    deprecated: false,
    ingredients: formData.ingredients.map(Number),
    // ingredients: Object.values(formData.ingredients).map(Number),
    // ingredients: ingredients,
    }
    console.log(newItem);
    // console.log(newItem);
    console.log(newItem.ingredients);
    console.log(5);
    console.log(`formData.item_price: ${formData.item_price}`);
    console.log(`parseFloat(formData.item_price): ${parseFloat(formData.item_price)}`);
    // ...
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
const [data, setData] = useState<InventoryItem[]>([]);
// const options = data.map((item) => ({ value: item.id, label: item.name }));

const form = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
  defaultValues: {
    ingredients: [],
  },
});

useEffect(() => {
  getAllInventoryItems().then((data) => {
  setData(data);
  });
}, []);






return (
    <Card className="w" style={{ height: '650px' }}>
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
          {data.map((item: InventoryItem, index) => {
            return (
              <FormField
                control={form.control}
                name={`ingredients.${item.name}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.name}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the amount of {item.name}.
                    </FormDescription>
                  </FormItem>
                )}
              />
            );
          })
        }
        <Button type="submit">Submit</Button>
        </form>
        </Form>
    </CardContent>
    </Card>
);
};
  
  export default SeasonalGUI;


  /* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild className="m-4">
                      <FormControl>
                        <Button
                          variant='outline'
                        >
                          <CalendarIcon className='mr-2' />
                          {field.value ? (format(field.value, 'PPP')) : (<span>Pick a date.</span>)}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        defaultMonth={new Date(2022, 0)}
                      >
                      </Calendar>
                    </PopoverContent>
                  </Popover>
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
                  <Popover>
                    <PopoverTrigger asChild className="mx-4">
                      <FormControl>
                        <Button
                          variant='outline'
                        >
                          <CalendarIcon className="mr-2" />
                          {field.value ? (format(field.value, 'PPP')) : (<span>Pick a date.</span>)}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        defaultMonth={new Date(2023, 0)}
                      >
                      </Calendar>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Enter the end date of the interval you want to see.
                  </FormDescription>
                </FormItem>
              )}
            /> */
              /* </div> */
              /* <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Ingredients</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        isMulti
                        options={options}
                        menuPlacement='top'
                      />
                    </FormControl>
                    <FormDescription>
                      Select the ingredients for the new menu item
                    </FormDescription>
                  </FormItem>
                )}
              /> */