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

const FormSchema = z.object({
  start_date: z.string(),
  end_date: z.string()
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
    const res = await getMostProductiveEmployeesInRange(formData.start_date, formData.end_date);
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
                  <FormControl>
                    <Input placeholder="e.g. 2022-01-01" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder="e.g. 2023-01-01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the end date of the interval you want to see.
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