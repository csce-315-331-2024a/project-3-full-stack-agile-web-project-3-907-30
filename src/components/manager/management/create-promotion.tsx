import { DetailedMenuItem, PairsAndAppearance } from "@/lib/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '../../ui/form';
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input';
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { putItemOnSale } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import React from "react";

export interface CreatePromotionProps {
    menuItem?: DetailedMenuItem
}

const FormSchema = z.object({
    sale_start: z.date({
        required_error: 'An end date is required.'
    }),
    sale_end: z.date({
        required_error: 'An end date is required.'
    }),
    sale_price: z.number()
});


const CreatePromotion = ({ menuItem }: CreatePromotionProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            sale_price: menuItem?.cur_price
        }
      })

    async function onSubmit(formData: z.infer<typeof FormSchema>) {

        const todaysDate = new Date();

        if(formData.sale_start < todaysDate) {
            toast({
                variant: "destructive",
                title: "Error!",
                description: "Sale must end in the future!",
              })
            return;
        }

        if(formData.sale_end <= todaysDate) {
            toast({
                variant: "destructive",
                title: "Error!",
                description: "Sale must start in the present!",
              })
              return;
        }

        if (formData.sale_end < formData.sale_start) {
			toast({
			  variant: "destructive",
			  title: "Error!",
			  description: "End date must be after start date.",
			});
			return;
        }

        const res = await putItemOnSale(menuItem!.item_name, formData.sale_price, formData.sale_start.toISOString().slice(0,10)
        , formData.sale_end.toISOString().slice(0,10));

        if (res.status === 200) {
            toast({
              title: "Success!",
              description: "Menu item sale status updated.",
            });
    
            // Close the dialog
            setDialogOpen(false);
            return;
        }
        else {
            toast({
                variant: "destructive",
                title: "Error!",
                description: "There was a problem putting the item on sale.",
              });

            return;
        }

    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>{'Put On Sale'}</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85%] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>{`Put the ${menuItem?.item_name} on sale.`}</DialogTitle>
                    <DialogDescription>
                        Set an item's sale price and the window of time it will be on sale.
                    </DialogDescription>
                </DialogHeader>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="sale_price"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sale Price</FormLabel>
                                    <FormControl>
                                    <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                    Set this item's sale price.
                                    </FormDescription>
                                </FormItem>
                                )}
                            />
                            <FormField
                            control={form.control}
                            name="sale_start"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sale Start</FormLabel>
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
                            name="sale_end"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sale End</FormLabel>
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
                                    Enter the start date of sale interval.
                                </FormDescription>
                                </FormItem>
                            )
                            }
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePromotion;