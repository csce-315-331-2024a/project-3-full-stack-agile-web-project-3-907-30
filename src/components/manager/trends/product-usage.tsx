import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { ProductUsageItem } from "@/lib/types";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { getProductUsageReportInRange } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '../../ui/form';
import { Input } from '../../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from '../../ui/button';
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
	start_date: z.date({
		required_error: 'A start date is required.'
	}),
	end_date: z.date({
		required_error: 'An end date is required.'
	})
})


/**
 * Component that displays product usage data.
 * @component
 * @example
 *   <ProductUsageTable data={[{id: 1, name: "Product A", amount: 10}, {id: 2, name: "Product B", amount: 5}]} />
 * @prop {ProductUsageItem[]} data - An array of objects containing information about each product usage item.
 * @description
 *   - Uses the Table, TableHeader, TableBody, TableRow, TableCell, and TableFooter components from Material UI.
 *   - Uses the map function to iterate through the data array and display each product usage item in a TableRow.
 *   - Uses the key prop to assign a unique key to each TableRow.
 *   - The data prop should be an array of objects with the following shape: {id: number, name: string, amount: number}.
 */
const ProductUsage = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
		},
	})

	var [formData, setFormData] = useState<ProductUsageItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
	}, [loading]);


	async function onSubmit(formData: z.infer<typeof FormSchema>) {


		 //  if the date inputted is after april 2024, toast "Cannot predict the future!"
		 if (formData.end_date.getFullYear() > 2024 || 
		 (formData.end_date.getFullYear() === 2024 && formData.end_date.getMonth() > 3)) {
		   toast({
			 variant: "destructive",
			 title: "Error!",
			 description: "Cannot Predict the future!",
		   });
		   return;
		 }

		 // if the start date is before january 2022, "Rev's wasnt opened! Please select a date after January 1st, 2022!"
		 if (formData.start_date.getFullYear() < 2022 ||
		 (formData.start_date.getFullYear() === 2022 && formData.start_date.getMonth() < 0)) {
		   toast({
			 variant: "destructive",
			 title: "Error!",
			 description: "Please select a date after January 1st, 2022!",
		   });
		   return;
		 }

		 // Date error checking
		 if (formData.end_date < formData.start_date) {
			toast({
			  variant: "destructive",
			  title: "Error!",
			  description: "End date must be after start date.",
			});
			return;
		  }
	  
		  if (!formData.start_date || !formData.end_date) {
			toast({
			  variant: "destructive",
			  title: "Error!",
			  description: "Please select both a start and end date.",
			});
			return;
		  }
	  
		//   if (formData.start_date.getFullYear() > 2024 || 
		//   (formData.start_date.getFullYear() === 2024 && formData.start_date.getMonth() > 3)) {
		// 	toast({
		// 	  variant: "destructive",
		// 	  title: "Error!",
		// 	  description: "Cannot predict the future!",
		// 	});
		// 	return;
		//   }

		const res = await getProductUsageReportInRange(formData.start_date.toDateString(), formData.end_date.toDateString());
		setFormData(res);
	}

	return (
		<Card className="max-h-[85%] overflow-y-scroll w-full">
			<CardHeader>
				<CardTitle>Product Usage Report</CardTitle>
				<CardDescription>View items that have been used within a certain date range.</CardDescription>
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
							name="end_date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>End Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild className="mx-4">
											<FormControl>
												<Button
													variant='outline'
												>
													<CalendarIcon className="mr-2" />
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
												defaultMonth={new Date(2023, 0)}
											>
											</Calendar>
										</PopoverContent>
									</Popover>
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
							<TableHead>Item Name</TableHead>
							<TableHead>Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							formData.map((item: ProductUsageItem) => {
								return (
									<TableRow key={item.id}>
										<TableCell>
											{item.name}
										</TableCell>
										<TableCell>
											{item.amount}
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

export default ProductUsage;