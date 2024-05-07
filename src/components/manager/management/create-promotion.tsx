import { DetailedMenuItem, PairsAndAppearance } from "@/lib/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '../../ui/form';
import { Button } from '../../ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '../../ui/input';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { putItemOnSale, resetMenuItemSale } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

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
    sale_price: z.string()
});


const CreatePromotion = ({ menuItem }: CreatePromotionProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            sale_price: menuItem?.cur_price.toString()
        }
      })

    async function onSubmit(formData: z.infer<typeof FormSchema>) {

        console.log(formData.sale_price, formData.sale_start, formData.sale_end);

        const todaysDate = new Date();

        console.log(todaysDate);

        if(formData.sale_start.getDay() < todaysDate.getDay()) {
            toast({
                variant: "destructive",
                title: "Error!",
                description: "Sale must start in the present!"
              })
            return;
        }

        if(formData.sale_end <= todaysDate) {
            toast({
                variant: "destructive",
                title: "Error!",
                description: "Sale must end in the future!"
              })
              return;
        }

        if (formData.sale_end < formData.sale_start) {
			toast({
			  variant: "destructive",
			  title: "Error!",
			  description: "End date must be after start date."
			});
			return;
        }

        const res = await putItemOnSale(menuItem!.item_name, formData.sale_price, formData.sale_start.toISOString().slice(0,10)
        , formData.sale_end.toISOString().slice(0,10));

        if (res.status === 200) {
            toast({
              title: "Success!",
              description: "Menu item sale status updated."
            });
    
            // Close the dialog
            setDialogOpen(false);
            return;
        }
        else {
            toast({
                variant: "destructive",
                title: "Error!",
                description: "There was a problem putting the item on sale."
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
                        Set an item&apos;s sale price and the window of time it will be on sale.
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
                                    Set this item&apos;s sale price.
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
                                        defaultMonth={new Date()}
                                    >
                                    </Calendar>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Enter the start date of the interval you want to see.
                                </FormDescription>
                                </FormItem>
                                )}
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
                                        defaultMonth={new Date()}
                                    >
                                    </Calendar>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Enter the start date of sale interval.
                                </FormDescription>
                                </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                <Button variant="destructive" onClick={() => resetMenuItemSale(menuItem?.item_name)}> Reset Item </Button>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePromotion;