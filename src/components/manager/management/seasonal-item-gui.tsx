import { DetailedMenuItem, InventoryItem } from '@/lib/types';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormDescription, FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '../../ui/input'
import { Button } from '../../ui/button';
import { toast } from '../../ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { useState, useEffect } from "react";
import { addMenuItem, getAllInventoryItems } from '@/lib/utils';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { formatISO } from "date-fns";

const FormSchema = z.object({
  item_name: z.string(),
  item_price: z.string(),
  points: z.string(),
  ingredients: z.array(z.string()),
  seasonal_item: z.boolean(),
});

const SeasonalGUI = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    const newItem: DetailedMenuItem = {
      item_id: 200,
      item_name: formData.item_name,
      item_price: parseFloat(formData.item_price),
      times_ordered: 0,
      points: parseInt(formData.points),
      cur_price: parseFloat(formData.item_price),
      seasonal_item: formData.seasonal_item,
      ingredients: formData.ingredients.map(Number),
      deprecated: false,
      sale_end: endDate ? formatISO(endDate, { representation: 'date' }) : null,
      sale_start: startDate ? formatISO(startDate, { representation: 'date' }) : null,
    };

    const res = await addMenuItem(newItem);

    if (res.status === 200) {
      toast({
        title: "Success!",
        description: "Menu item added.",
      });

      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "There was a problem adding the item.",
      });
    }
  }

  const [data, setData] = useState<InventoryItem[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ingredients: [],
      seasonal_item: false,
    },
  });

  useEffect(() => {
    getAllInventoryItems().then((data) => {
      setData(data);
      form.reset({
        ingredients: Array(data.length).fill("0"),
      })
    });
  }, [form]);

  const isSeasonal = form.watch('seasonal_item');
  useEffect(() => {
    if (!isSeasonal) {
      // const defaultDate = new Date(2022, 1, 2);
      // setStartDate(defaultDate);
      // setEndDate(defaultDate);
      setStartDate(null);
      setEndDate(null);
    }
  }, [isSeasonal]);

  return (
    <Card className="w" style={{ height: '650px' }}>
      <CardHeader>
        <CardTitle>Add An Item</CardTitle>
        <CardDescription>Enter the item you want to add to the menu.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 overflow-y-scroll" style={{ maxHeight: '550px' }}>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="seasonal_item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is this a seasonal item?</FormLabel>
                  <FormControl>
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                      }}
                      value="seasonal_item"
                    />
                  </FormControl>
                  <FormDescription>
                    Check this if the item is a seasonal item.
                  </FormDescription>
                </FormItem>
              )}
            />

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
                    Enter the name of the menu item.
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
                    Enter the price you want to set for the new item.
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
                    Enter how many points you want this item to have.
                  </FormDescription>
                </FormItem>
              )}
            />

            {data.map((item: InventoryItem, index) => {
              return (
                <FormField
                  key={index}
                  control={form.control}
                  name={`ingredients.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.name}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 10"
                          defaultValue="0" {...field}
                          onClick={(e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.value === "0") {
                              target.value = "";
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the amount of {item.name}.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              );
            })}
          {isSeasonal && (
            <>
            <Popover>
              <PopoverTrigger asChild className="m-4">
                <FormControl>
                  <Button variant='outline'>
                    <CalendarIcon className='mr-2' />
                    {startDate ? (format(startDate, 'PPP')) : (<span>Pick a start date.</span>)}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode='single'
                  selected={startDate}
                  onSelect={(date) => {
                    if (date) {
                      setStartDate(date);
                    }
                  }}
                  initialFocus
                  defaultMonth={new Date(2023, 0)}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild className="mx-4">
                <FormControl>
                  <Button variant='outline'>
                    <CalendarIcon className="mr-2" />
                    {endDate ? (format(endDate, 'PPP')) : (<span>Pick an end date.</span>)}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode='single'
                  selected={endDate}
                  onSelect={(date) => {
                    if (date) {
                      setEndDate(date);
                    }
                  }}
                  initialFocus
                  defaultMonth={new Date(2023, 2)}
                />
              </PopoverContent>
            </Popover>
            </>
          )}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default SeasonalGUI;
