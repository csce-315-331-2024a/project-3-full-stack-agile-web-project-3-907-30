import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from '../ui/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { getCustomerFromDatabase, putCustomerInLocalStorage } from '@/lib/utils';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { Customer } from '@/lib/types';

import CustomerSignUp from './customer-sign-up';
import { CircleUser } from 'lucide-react';

interface RewardsButtonProps {
	setCustomer: Dispatch<SetStateAction<Customer | undefined>>;
}

const FormSchema = z.object({
	phone: z.string().min(10, {
		message: "Your phone number must be 10 characters."
	}),
})

/**
 * Button that allows cutomers to sign into their rewards account. 
 * 
 * @component
 * @param {RewardsButtonProps} setCustomer useState function that updates to the customer that logs in.
 * @returns {JSX.Element} The rewards sign-in button.
 */
const RewardsButton = ({ setCustomer}: RewardsButtonProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			phone: "",
		},
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		// Get and store customer information 
		const customer = await getCustomerFromDatabase(data.phone);

		await putCustomerInLocalStorage(customer!);

		const customerName: string = localStorage.getItem('customerName')!;
		if (customer) {
			toast({
				title: "Success!",
				description: `Welcome back, ${customerName}`,
			});

			// reset the form and close the dialog
			form.reset();
			setCustomer(customer);
			setDialogOpen(false);
		} else {
			toast({
				variant: "destructive",
				title: "Error!",
				description: "Customer not found.",
			});
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" data-testid="sign-in">
					<span className="hidden lg:block">Sign-in for Rewards</span>
					<span className="block lg:hidden text-xs">
						Rewards
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="min-w-fit">
				<DialogHeader>
					<DialogTitle>View your points</DialogTitle>
					<DialogDescription>
						Sign-in to view your points.
					</DialogDescription>
					<DialogDescription className="block lg:hidden">
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col md:flex-row pt-4 notranslate">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<InputOTP maxLength={10} {...field}>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={6} />
													<InputOTPSlot index={7} />
													<InputOTPSlot index={8} />
													<InputOTPSlot index={9} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormDescription>
											Please enter your phone number to access your points.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<CustomerSignUp />
								<Button type="submit">Sign-in</Button>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default RewardsButton;
