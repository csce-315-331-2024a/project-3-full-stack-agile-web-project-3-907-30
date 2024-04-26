import { DetailedMenuItem } from "@/lib/types";
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
import { addMenuItem, getInventoryItem, updateInventoryItem } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface MenuManagementFormProps {
  menuItem?: DetailedMenuItem;
  editMode: boolean;
  setDataChanged: any;
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

const InventoryManagementForm = ({ inventoryItem, editMode, setDataChanged }: InventoryManagementFormProps) => {
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
        setDataChanged((prev: boolean) => !prev);
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

      const res = await addMenuItem(newItem);

      if (res.status === 200) {
        toast({
          title: "Success!",
          description: "Inventory item added.",
        });

        // reset form, let table know data has changed, close the dialog
        form.reset();
        setDataChanged((prev: boolean) => !prev);
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
        
      </DialogContent>
    </Dialog>
  );
}

export default InventoryManagementForm;