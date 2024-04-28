import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MostProductiveEmployeeItem } from "@/lib/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '../../ui/form';
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { getMostProductiveEmployeesInRange } from "@/lib/utils";
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
 * Displays a table of the most productive employees based on their total number of orders.
 * @component
 * @example
 *   <MostProductiveEmployeesTable data={sample_data} />
 * @prop {MostProductiveEmployeeItem[]} data - An array of objects containing information about the most productive employees.
 * @description
 *   - Uses the data prop to map through the array and display the employee name and total orders in a table.
 *   - Uses the id, name, and total_orders properties from each object in the data array.
 *   - Does not have any lifecycle methods.
 *   - Renders a Table component from the Material-UI library.
 */
const MostProductiveEmployees = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
    },
  })

  var [formData, setFormData] = useState<MostProductiveEmployeeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  async function onSubmit(formData: z.infer<typeof FormSchema>) {

     //  if the date inputted is after april 2024, toast "Cannot predict the future!"
     if (formData.end_date.getFullYear() > 2024 || 
     (formData.end_date.getFullYear() === 2024 && formData.end_date.getMonth() > 3)) {
       toast({
         variant: "destructive",
         title: "Error!",
         description: "Cannot Predict the future!",
       });
       return;
     }

     // if the start date is before january 2022, "Rev's wasnt opened! Please select a date after January 1st, 2022!"
     if (formData.start_date.getFullYear() < 2022 ||
      (formData.start_date.getFullYear() === 2022 && formData.start_date.getMonth() < 0)) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Please select a date after January 1st, 2022!",
        });
        return;
      }


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
      
    const res = await getMostProductiveEmployeesInRange(formData.start_date.toDateString(), formData.end_date.toDateString());
    setFormData(res);
  }

  return (
    <Card className="max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Most Productive Employees</CardTitle>
        <CardDescription>See which employees make the most orders.</CardDescription>
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
              <TableHead>Employee Name</TableHead>
              <TableHead>Total Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              formData.map((item: MostProductiveEmployeeItem) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.name}
                    </TableCell>
                    <TableCell>
                      {item.total_orders}
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
  );
}

export default MostProductiveEmployees;