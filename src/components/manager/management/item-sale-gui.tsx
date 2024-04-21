import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
import { updateMenuItemPrice } from '@/lib/utils';

const FormSchema = z.object({
  item_name: z.string(),
  item_price: z.string()
})

/**
   * A form component for updating menu item prices
   * @component
   * @example
   *   <UpdateItemPricesForm item_name="Bacon Cheeseburger" item_price="9.99" />
   * @prop {string} item_name - The name of the menu item to be updated
   * @prop {number} item_price - The new price for the menu item
   * @description
   *   - Uses useForm hook from react-hook-form to handle form validation and submission
   *   - Renders a form with two fields: item_name and item_price
   *   - On form submission, calls the updateMenuItemPrice function with the entered data
   *   - Uses zod library for form schema validation
   */
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
              render={({ field }) => (
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
              render={({ field }) => (
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
