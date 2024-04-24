// import { Button } from '../../ui/button';
// import { z } from "zod"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { toast } from '../../ui/use-toast';
// import { Input } from '../../ui/input'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
// import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../../ui/form';
// import { CalendarIcon } from "@radix-ui/react-icons"
// import { format } from "date-fns"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { useEffect, useState } from "react";
// import Select from 'react-select';
// import { deleteInventoryItem, getAllInventoryItems } from '@/lib/utils';
// import { InventoryItem } from '@/lib/types';


  

  
// const FormSchema = z.object({
//   item_name: z.string(),
//   item_price: z.number().positive("Price must be a positive number."),
//   times_ordered: z.number().int("Times ordered must be an integer."),
//   points: z.number().int("Points must be an integer."),
//   cur_price: z.number().positive("Current price must be a positive number."),
//   seasonal_item: z.boolean(),
//   deprecated: z.boolean(),
//   start_date: z.date({
//     required_error: 'A start date is required.'
//   }),
//   end_date: z.date({
//     required_error: 'An end date is required.'
//   }),
//   options: z.array(z.object({
//     value: z.number(),
//     label: z.string()
//   })),
//   ingredients: z.array(z.object({
//     inv_id: z.number(),
//     amount: z.number().positive()
//   }))
// });
  
//   const SeasonalGUI = () => {
//     const form = useForm<z.infer<typeof FormSchema>>({
//       resolver: zodResolver(FormSchema),
//       defaultValues: {
//         deprecated: false,
//         seasonal_item: true,
//         times_ordered: 0,
//       }
//     });


//     const [data, setData] = useState<InventoryItem[]>([]);
//     const options = data.map((item) => ({ value: item.id, label: item.name }));



//     useEffect(() => {
//       getAllInventoryItems().then((data) => {
//         setData(data);
//       });
//     }, []);
    


//     const [showCard, setShowCard] = useState(false);
//     const [selected, setSelected] = useState(false);
//     const [isDeprecated, setIsDeprecated] = useState(false);
    
//     async function onSubmit(formData: z.infer<typeof FormSchema>) {
//       // not the right function, will make function later
//       const res = await getSalesReportInRange(formData.start_date.toDateString(), formData.end_date.toDateString());
//       setFormData(res);

//       // cur price = item price here
//     }
  
//     return (
//       <Card className="w-3/5" style={{ height: '650px' }}>
//         <CardHeader>
//           <CardTitle>Add A Seasonal Item</CardTitle>
//           <CardDescription>Enter the seasonal item you want to add to the menu.</CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-6 overflow-y-scroll" style={{ maxHeight: '550px' }}>
//           <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="item_name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Item Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Peppermint Milkshake" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     Enter the name of the seasonal menu item
//                   </FormDescription>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="item_price"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Set Price</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter the new price here" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     Enter the price you want to set for the seasonal item.
//                   </FormDescription>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="points"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Enter Points for Item</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. 10" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     Enter how many points you want this item to have
//                   </FormDescription>
//                 </FormItem>
//               )}
//             />
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <FormField
//               control={form.control}
//               name="start_date"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Start Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild className="m-4">
//                       <FormControl>
//                         <Button
//                           variant='outline'
//                         >
//                           <CalendarIcon className='mr-2' />
//                           {field.value ? (format(field.value, 'PPP')) : (<span>Pick a date.</span>)}
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent>
//                       <Calendar
//                         mode='single'
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         initialFocus
//                         defaultMonth={new Date(2022, 0)}
//                       >
//                       </Calendar>
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>
//                     Enter the start date of the interval you want to see.
//                   </FormDescription>
//                 </FormItem>
//               )
//               }
//             />
//              <FormField
//               control={form.control}
//               name="end_date"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>End Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild className="mx-4">
//                       <FormControl>
//                         <Button
//                           variant='outline'
//                         >
//                           <CalendarIcon className="mr-2" />
//                           {field.value ? (format(field.value, 'PPP')) : (<span>Pick a date.</span>)}
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent>
//                       <Calendar
//                         mode='single'
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         initialFocus
//                         defaultMonth={new Date(2023, 0)}
//                       >
//                       </Calendar>
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>
//                     Enter the end date of the interval you want to see.
//                   </FormDescription>
//                 </FormItem>
//               )}
//             />
//               </div>
//               <FormField
//                 control={form.control}
//                 name="ingredients"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Add Ingredients</FormLabel>
//                     <FormControl>
//                       <Select
//                         {...field}
//                         isMulti
//                         options={options}
//                         menuPlacement='top'
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Select the ingredients for the new menu item
//                     </FormDescription>
//                   </FormItem>
//                 )}
//               />
//             <Button type="submit">Submit</Button>
//           </Form>
//         </CardContent>
//       </Card>
//     );
//   };
  
//   export default SeasonalGUI;