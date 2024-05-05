import { DetailedMenuItem, InventoryItem } from "@/lib/types";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormDescription, FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import cn from "classnames";
import { addMenuItem, getAllInventoryItems, updateMenuItem } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

/**
 * 
 * @param {menuItem?} The menu item which is currently being edited
 * @param {editMode} True if an item is being edited, false otherwise
 * @param {setDataChanged} A state variable which allows the menu data to be updated
 * @returns {JSX.Element} The MenuManagementForm component.
 * @example
 *  <MenuManagementForm menuItem={item} editMode={true} setDataChanged={setDataChanged} />
 * @description
 * This component is a form that allows the manager to view and update a menu item.
 * The manager can update the name, price, times_ordered, points, current price, seasonal item status, deprecated status, and ingredients
 * Uses Form component from Shad CN UI and zod resolver to validate form data.
 */


export interface MenuManagementFormProps {
  menuItem?: DetailedMenuItem;
  editMode: boolean;
}

const FormSchema = z.object({
  item_name: z.string(),
  item_price: z.string(),
  times_ordered: z.string(),
  points: z.string(),
  cur_price: z.string(),
  seasonal_item: z.boolean(),
  deprecated: z.boolean(),
  ingredients: z.array(z.string().optional()),
})

const MenuManagementForm = ({ menuItem, editMode }: MenuManagementFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item_name: editMode ? menuItem?.item_name : '',
      item_price: editMode ? menuItem?.item_price.toString() : '',
      times_ordered: editMode ? menuItem?.times_ordered.toString() : '',
      points: editMode ? menuItem?.points.toString() : '',
      cur_price: editMode ? menuItem?.cur_price.toString() : '',
      seasonal_item: editMode ? menuItem?.seasonal_item : false,
      deprecated: editMode ? menuItem?.deprecated : false,
    },
  })

  const [data, setData] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getAllInventoryItems().then((data) => {
      setData(data);
    });
  }, [form]);



  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (editMode) {
      const updatedItem: DetailedMenuItem = {
        item_id: menuItem?.item_id!,
        item_name: formData.item_name,
        item_price: parseFloat(formData.item_price),
        times_ordered: parseInt(formData.times_ordered),
        points: parseInt(formData.points),
        cur_price: parseFloat(formData.cur_price),
        seasonal_item: formData.seasonal_item,
        deprecated: formData.deprecated,
        ingredients: formData.ingredients.map(Number),
        sale_end: null,
        sale_start: null,
      }

      const res = await updateMenuItem(updatedItem);

      if (res.status === 200) {
        toast({
          title: "Success!",
          description: "Menu item updated.",
        });

        // let table know data has changed, close the dialog
        setDialogOpen(false);
      }
      else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "There was a problem updating the item.",
        });
      }
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>{'Edit'}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85%] overflow-y-scroll w-full">
        <DialogHeader>
          <DialogTitle>{editMode ? `Editing ${menuItem?.item_name}` : 'Add an Item'}</DialogTitle>
          <DialogDescription>
            {editMode ? 'Edit the fields you want to change.' : 'Fill out the form below to add a new inventory item.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="item_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input type="number" {...field} />
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
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter how many points you want this item to have
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cur_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter the current price for the item</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the price of the new item.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seasonal_item"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-between items-center space-x-2">
                    <FormLabel>Seasonal Item?</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )
                }
              />
              <FormField
                control={form.control}
                name="deprecated"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-between items-center space-x-2">
                    <FormLabel> Deprecated?</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )
                }
              />
              {
                data.map((item: InventoryItem, index) => {
                  return (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`ingredients.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enter the amount of inventory item {item.name}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 10"
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
                            Enter the amount of item {item.name}.
                          </FormDescription>
                        </FormItem>)}
                    />
                  )
                })
              }

              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MenuManagementForm;