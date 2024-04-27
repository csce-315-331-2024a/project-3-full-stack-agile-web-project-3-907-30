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
import { SalesReportItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input'
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { getSalesReportInRange } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"



const FormSchema = z.object({
  start_date: z.date({
    required_error: 'A start date is required.'
  }),
  end_date: z.date({
    required_error: 'An end date is required.'
  })
})

/**
 * Component that displays sales report data
 * @component
 * @example
 *   <SalesReportTable data={salesData} />
 * @prop {SalesReportItem[]} data - An array of sales report items
 * @description
 *   - The component renders a table with two columns: Item Name and Profits.
 *   - The data prop is an array of objects with properties id, name, and profit.
 *   - The component calculates and displays the total profits from the data.
 *   - The data is mapped to table rows using the map function.
 */
const SalesReport = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
    },
  })

  var [formData, setFormData] = useState<SalesReportItem[]>([]);
  const [loading, setLoading] = useState(true);

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


    const res = await getSalesReportInRange(formData.start_date.toDateString(), formData.end_date.toDateString());
    setFormData(res);
  }

  return (
    <Card className="max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Sales Report</CardTitle>
        <CardDescription>View profits from sales within a specific date range.</CardDescription>
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
                  {/* <FormControl>
                    <Input placeholder="e.g. 2022-01-01" {...field} />
                  </FormControl> */}
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
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        {formData.length !== 0 && (<Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Profits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              formData.map((item: SalesReportItem) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.name}
                    </TableCell>
                    <TableCell>
                      ${item.profit}
                    </TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>
                Total Profits:
              </TableCell>
              <TableCell>
                ${formData.reduce((accum, curr) => {
                  return accum + curr.profit;
                }, 0).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>)}
      </CardContent>
    </Card>
  );
}

export default SalesReport;