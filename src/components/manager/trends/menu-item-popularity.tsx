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
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  start_date: z.date({
    required_error: 'A start date is required.'
  }),
  end_date: z.date({
    required_error: 'An end date is required.'
  })
})

/**
 * Shows the Menu Item Popularity trend in table format.
 * 
 * @component
 * @param {PopularMenuItem[]} data The input data holding the result of database call.
 * @returns {JSX.Element} The Menu Item Popularity table component.
 */
const MenuItemPopularity = () => {

  const [formData, setFormData] = useState<PopularMenuItem[]>([]);
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
    // Date error checking
		 if (formData.end_date < formData.start_date) {
			toast({
			  variant: "destructive",
			  title: "Error!",
			  description: "End date must be after start date.",
			});
			return;
		  }
	  
		  if (!formData.start_date || !formData.end_date) {
			toast({
			  variant: "destructive",
			  title: "Error!",
			  description: "Please select both a start and end date.",
			});
			return;
		  }

    const res = await menuItemsPopularity(formData.start_date.toISOString().slice(0,10), 
    formData.end_date.toISOString().slice(0,10));
    setFormData(res);
  }


  return (<>
    <Card className="max-h-[85%] overflow-y-scroll w-full">
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        {formData.length !== 0 && (<Table className="overflow-hidden">
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
        </Table>)}
      </CardContent>
    </Card>
  </>);
}

export default MenuItemPopularity;