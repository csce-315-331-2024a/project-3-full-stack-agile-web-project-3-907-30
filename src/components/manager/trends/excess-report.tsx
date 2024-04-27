import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getExcessReport } from "@/lib/utils";
import { ExcessReportItem } from "@/lib/types";
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '../../ui/form';
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from '../../ui/use-toast';


const FormSchema = z.object({
  start_date: z.date({
    required_error: 'A start date is required.'
  })
  
})

const ExcessReport = () => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
    },
  })

  var [data, setData] = useState<ExcessReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  async function onSubmit(formData: z.infer<typeof FormSchema>) {


    if (!formData.start_date) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "A start date is required.",
      });
      return;
    }


    const res = getExcessReport(formData.start_date.toDateString());
    data = await res;
    setData(data);
  }

  return (
    <Card className="max-h-[85%] overflow-y-scroll w-full">
      <CardHeader>
        <CardTitle>Excess Report</CardTitle>
        <CardDescription>View items that have barely been used.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Form {...form}>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        {data.length !== 0 && (<Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Initial Amount</TableHead>
              <TableHead>Percent Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              data.map((item: ExcessReportItem) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.name}
                  </TableCell>
                  <TableCell>
                    {item.initial_amount}
                  </TableCell>
                  <TableCell>
                    {item.percent_used}
                  </TableCell>
                </TableRow>
              )
              )
            }
          </TableBody>
          <TableFooter>

          </TableFooter>
        </Table>)}
      </CardContent>
    </Card>
  );
}

export default ExcessReport;