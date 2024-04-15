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
import { getCustomerFromDatabase, newCustomer } from '@/lib/utils';
import { useState } from 'react';
import { Customer } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';
import { Input } from "@/components/ui/input"


const FormSchema = z.object({
    firstname: z.string().min(1, {
        message: "Input a first name"
    } ),
    lastname: z.string().min(1, {
        message: "Input a last name"
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits"
    })
})

/**
 * A dialog component for creating a new customer account
 * 
 * @component
 * @description
 *   - Uses the Dialog component from Chakra UI to display a form for creating a new customer account
 *   - Utilizes useForm and zodResolver from React Hook Form and Zod to validate and handle form data
 *   - Displays a success or error toast message upon form submission
 *   - Resets the form and closes the dialog upon successful submission
 */
/**
 * @prop {string} firstname - The first name of the customer
 * @prop {string} lastname - The last name of the customer
 * @prop {string} phone - The phone number of the customer
 */
const CustomerSignUp = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          firstname: "",
          lastname: "",
          phone: ""
        }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const fullName = data.firstname + " " + data.lastname;

        const message = await newCustomer(fullName, data.phone);

        if(message === "Customer was not inserted") {
            toast({
                variant: "destructive",
                title: "Error!",
                description: "There was an error making your account, please review information and try again",
              });
        }
        else {
            toast({
                title: "Success!",
                description: `Welcome to the family, ${fullName}`,
              });
            // reset the form and close the dialog
            form.reset();
            setDialogOpen(false);
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    No Account? Sign-up Here
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Earn Points!</DialogTitle>
                    <DialogDescription>Make an account to begin earning rewards.</DialogDescription>
                </DialogHeader>
                <div className="flex pt-4 notranslate">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({ field }) =>(
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john" {...field}/>
                                        </FormControl>
                                        <FormDescription>Your first name</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }) =>(
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="smith" {...field}/>
                                        </FormControl>
                                        <FormDescription>Your last name</FormDescription>
                                    </FormItem>
                                )}
                            />
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
                                    Enter your phone number to finish creating an account.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Make Account</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CustomerSignUp
