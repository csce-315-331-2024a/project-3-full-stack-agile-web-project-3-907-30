import { InventoryItem } from "@/lib/types";
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
import { addInventoryItem, getInventoryItem, updateInventoryItem } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface InventoryManagementFormProps {
  inventoryItem?: InventoryItem;
  editMode: boolean;
}

const FormSchema = z.object({
  name: z.string(),
  price: z.string(),
  fill_level: z.string(),
  curr_level: z.string(),
  times_refilled: z.string(),
  date_refilled: z.any(),
  has_dairy: z.boolean(),
  has_nuts: z.boolean(),
  has_eggs: z.boolean(),
  is_vegan: z.boolean(),
  is_halal: z.boolean(),
})

const InventoryManagementForm = ({ inventoryItem, editMode }: InventoryManagementFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: editMode ? inventoryItem?.name : '',
      price: editMode ? inventoryItem?.price.toString() : '',
      fill_level: editMode ? inventoryItem?.fill_level.toString() : '',
      curr_level: editMode ? inventoryItem?.curr_level.toString() : '',
      times_refilled: editMode ? inventoryItem?.times_refilled.toString() : '',
      date_refilled: editMode ? inventoryItem?.date_refilled.toString() : new Date().toString(),
      has_dairy: editMode ? inventoryItem?.has_dairy : false,
      has_nuts: editMode ? inventoryItem?.has_nuts : false,
      has_eggs: editMode ? inventoryItem?.has_eggs : false,
      is_vegan: editMode ? inventoryItem?.is_vegan : false,
      is_halal: editMode ? inventoryItem?.is_halal : false,
    },
  })

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (editMode) {
      const updatedItem: InventoryItem = {
        id: inventoryItem?.id!,
        name: formData.name,
        price: parseFloat(formData.price),
        fill_level: parseInt(formData.fill_level),
        curr_level: parseInt(formData.curr_level),
        times_refilled: parseInt(formData.times_refilled),
        date_refilled: new Date(formData.date_refilled),
        has_dairy: formData.has_dairy,
        has_nuts: formData.has_nuts,
        has_eggs: formData.has_eggs,
        is_vegan: formData.is_vegan,
        is_halal: formData.is_halal,
      }

      const res = await updateInventoryItem(updatedItem);

      if (res.status === 200) {
        toast({
          title: "Success!",
          description: "Inventory item updated.",
        });

        // let table know data has changed, close the dialog
        setDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "There was a problem updating the item.",
        });
      }
    } else {
      // add new item
      const newItem: InventoryItem = {
        id: 0,
        name: formData.name,
        price: parseFloat(formData.price),
        fill_level: parseInt(formData.fill_level),
        curr_level: parseInt(formData.curr_level),
        times_refilled: parseInt(formData.times_refilled),
        date_refilled: new Date(formData.date_refilled),
        has_dairy: formData.has_dairy,
        has_nuts: formData.has_nuts,
        has_eggs: formData.has_eggs,
        is_vegan: formData.is_vegan,
        is_halal: formData.is_halal,
      }

      const res = await addInventoryItem(newItem);

      if (res.status === 200) {
        toast({
          title: "Success!",
          description: "Inventory item added.",
        });

        // reset form, let table know data has changed, close the dialog
        form.reset();
        setDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "There was a problem adding the item.",
        });
      }
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>{editMode ? 'Edit' : 'Add an Item'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode ? `Editing ${inventoryItem?.name}` : 'Add an Item'}</DialogTitle>
          <DialogDescription>
            {editMode ? 'Edit the fields you want to change.' : 'Fill out the form below to add a new inventory item.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )
                }
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )
                }
              />
              <FormField
                control={form.control}
                name="fill_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fill Level</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )
                }
              />
              <FormField
                control={form.control}
                name="curr_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Level</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )
                }
              />
              <FormField
                control={form.control}
                name="times_refilled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Times Refilled</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )
                }
              />
              <FormField
                control={form.control}
                name="date_refilled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Refilled</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[223px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="notranslate"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="has_dairy"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-between items-center space-x-2">
                    <FormLabel>Dairy?</FormLabel>
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
                name="has_nuts"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-between items-center space-x-2">
                    <FormLabel>Nuts?</FormLabel>
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
                name="has_eggs"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-between items-center space-x-2">
                    <FormLabel>Eggs?</FormLabel>
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
                name="is_vegan"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-between items-center space-x-2">
                    <FormLabel>Vegan?</FormLabel>
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
                name="is_halal"
                render={({ field }) => (
                  <FormItem className="flex w-full justify-between items-center space-x-2">
                    <FormLabel>Halal?</FormLabel>
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
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default InventoryManagementForm;