// import { zodResolver } from "@hookform/resolvers/zod"
// import { Check, ChevronsUpDown } from "lucide-react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Translate } from "@/pages/api/customer/translate"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormProps
// } from "@/components/ui/form"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { toast } from "@/components/ui/use-toast"
// import { useState } from "react"


// interface comboboxFormProps {
//   onLanguageChange: (language: string) => void;
// }


// const languages = [
//   { label: "English", value: "en" },
//   { label: "French", value: "fr" },
//   { label: "German", value: "de" },
//   { label: "Spanish", value: "es" },
//   { label: "Portuguese", value: "pt" },
//   { label: "Russian", value: "ru" },
//   { label: "Japanese", value: "ja" },
//   { label: "Korean", value: "ko" },
//   { label: "Chinese", value: "zh" },
// ] as const

// const FormSchema = z.object({
//   language: z.string({
//     required_error: "Please select a language.",
//   }),
// })


// export function ComboboxForm({ onLanguageChange }: comboboxFormProps) {
//   const { control, handleSubmit, setValue, formState } = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   })

 

//     const onSubmit = async (data: z.infer<typeof FormSchema>) => {
//         try {
//             const response: Response = await fetch('/api/customer/translate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     text: 'Hello, world!',
//                     from: 'en',
//                     to: data.language
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Error fetching translation');
//             }

//             const { translation } : Translate = await response.json();

//             toast({
//                 title: 'Translation',
//                 description: translation,
//             });
//         } catch (error) {
//             console.error('Translation error', error);
//         }
//     }

//   const handleLanguageChange = (language: string) => {
//     setValue("language", language);
//     onLanguageChange(language);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={control}
//           name="language"
//           render={({ field }) => (
//             <FormItem className="flex flex-row items-center">
//               <FormLabel style={{ marginRight: '10px', marginTop: '10px' }}>🌐</FormLabel>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <FormControl>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       className={cn(
//                         "w-[200px] justify-between",
//                         !field.value && "text-muted-foreground"
//                       )}
//                     >
//                       {field.value
//                         ? languages.find(
//                             (language) => language.value === field.value
//                           )?.label
//                         : "Change Language"}
//                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </FormControl>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[200px] p-0">
//                   <Command>
//                     <CommandInput placeholder="Search language..." />
//                     <CommandEmpty>No language found.</CommandEmpty>
//                     <CommandGroup>
//                       {languages.map((language) => (
//                         <CommandItem
//                           value={language.label}
//                           key={language.value}
//                           onSelect={() => {
//                             form.setValue("language", language.value);
//                             handleLanguageChange(language.value);
//                           }}
//                         >
//                           <Check
//                             className={cn(
//                               "mr-2 h-4 w-4",
//                               language.value === field.value
//                                 ? "opacity-100"
//                                 : "opacity-0"
//                             )}
//                           />
//                           {language.label}
//                         </CommandItem>
//                       ))}
//                     </CommandGroup>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </form>
//   )

// }


// export default ComboboxForm
