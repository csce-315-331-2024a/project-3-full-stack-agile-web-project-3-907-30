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
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface OrderManagementFormProps {
  orderItem: OrderItem;
  setDataChanged: any;
}

const FormSchema = z.object({
  status: z.string(),
})

const InventoryManagementForm = ({ orderItem, setDataChanged }: OrderManagementFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ingredientQuantities, setIngredientQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchIngredients() {
      setLoading(true);
      try {
        const res = await fetch("/api/inventory/get-all");
        const data = await res.json();
        const ingredients_names = data.map((item: any) => item.name);
        setIngredients(ingredients_names);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchIngredients();
  }, []);
  
  
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Editing Order #${orderItem.order_id}`}</DialogTitle>
          <DialogDescription>
            Change the order status.
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-rows-2 gap-4">
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
                )}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button>Customize Ingredients</Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  className="max-w-xs max-h-60 overflow-y-auto"
                >
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">Ingredients:</h3>
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{ingredient}</span>
                          <input
                            type="number"
                            min="0"
                            value={ingredientQuantities[ingredient] || 0}
                            onChange={(e) =>
                              setIngredientQuantities({
                                ...ingredientQuantities,
                                [ingredient]: parseInt(e.target.value, 10) || 0,
                              })
                            }
                            className="w-16 px-2 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default InventoryManagementForm;