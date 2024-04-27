import { OrderItem } from "@/lib/types";
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
import { Button } from '@/components/ui/button';
import {  updateOrderItemStatus } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export interface OrderManagementFormProps {
  orderItem: OrderItem;
  setDataChanged: any;
}

const FormSchema = z.object({
  status: z.string(),
})

const InventoryManagementForm = ({ orderItem, setDataChanged }: OrderManagementFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: `${orderItem.status}`,
    },
  })

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    const res = await updateOrderItemStatus(orderItem.order_id, Number(formData.status));

    if (res.status === 200) {
      toast({
        title: "Success!",
        description: "Order updated.",
      });

      // let table know data has changed, close the dialog
      setDataChanged((prev: boolean) => !prev);
      setDialogOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "There was a problem updating the order.",
      });
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="notranslate">
        <DialogHeader>
          <DialogTitle>{`Editing Order #${orderItem.order_id}`}</DialogTitle>
          <DialogDescription>
            Change the order status.
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="-1">Cancelled</SelectItem>
                        <SelectItem value="0">Pending</SelectItem>
                        <SelectItem value="1">Fulfilled</SelectItem>
                      </SelectContent>
                    </Select>
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