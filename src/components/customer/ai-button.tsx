import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { useState, Dispatch, SetStateAction } from 'react';
import { Input } from '../ui/input';

import { Button } from '../ui/button';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from '../ui/use-toast';
import Groq from 'groq-sdk';
import { FormProvider } from 'react-hook-form';


// const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
const groq = new Groq({apiKey: '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', dangerouslyAllowBrowser:true });

interface AiButtonProps {
  setFoodRecommendations: Dispatch<SetStateAction<string[]>>;
}

const FormSchema = z.object({
  feeling: z.string().min(1, {
    message: "Please enter how you're feeling."
  }),
});

const AiButton = ({ setFoodRecommendations }: AiButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      feeling: "",
    },
  });  

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Create a Groq API request to get food recommendations
    const request = {
      messages: [
        {
            role: "system",
            content: "You are a food connoisseur and make the best food recommendations after a person tells you how they are feeling. To create your recommendations you must choose from the following and nothing else: Classic Hamburger, Double Stack Burger, Gig Em Patty Melt, Cheeseburger, Revs Grilled Chicken, Sandwich Spicy Chicken Sandwich, 2 Corn Dog Value Meal, 2 Hot Dog Value Meal, 3 Tender Entree, 3 Chicken Tender Combo, Aggie Shake (Oreo), Aggie Shake (Chocolate), Aggie Shake (Vanilla), Aggie Shake (Strawberry), Cookie Ice Cream Sundae, Aquafina Water 16OZ, Aquafina Water 20OZ, 20 oz Fountain Drink, Chicken Wraps, Fish Sandwich, Tuna Melt, Aggie Chicken Club, French Fries, Double Scoop Ice Cream, Root Beer Float, Black Bean Burger, Bacon Cheeseburger ."
        },
        {
          role: 'user',
          content: `I'm feeling ${data.feeling}. What food would you recommend?`,
        },
      ],
      model: 'mixtral-8x7b-32768',
    };

    const response = await groq.chat.completions.create(request);
    const recommendations = response.choices[0].message.content;

    setFoodRecommendations(recommendations.split(", "));

    toast({
      title: "Food Recommendations",
      description: `Based on your input, we recommend: ${recommendations}`,
    });

    form.reset();
    setDialogOpen(false);
  }


  return (
    <FormProvider {...form}>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="ai-button">
          AI Recommendations
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How are you feeling today?</DialogTitle>
          <DialogDescription>
            Tell us how you're feeling, and we'll your AI assistant will recommend some food to match your mood!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="feeling"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription className='py-3'>
                  Please enter how you're feeling (e.g. happy, sad, hungry, etc.).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Get Recommendations</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </FormProvider>
  );
};

export default AiButton;