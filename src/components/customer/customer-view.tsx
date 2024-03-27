
import { Button } from '@/components/ui/button';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


// Create a list of items that can be ordered by the customer (before using the database)
const item_category = [
{
  category: "Burger",
  items: [
    { name: "Cheeseburger", img: "/menu-item-pics/cheeseburger.jpeg", price: 5.99 },
    { name: "Hamburger", img: "/menu-item-pics/hamburger.jpeg", price: 4.99 },
    { name: "Veggie Burger", img: "/veggie-burger.jpeg", price: 6.99 },
    { name: "Bacon Cheeseburger", img: "/bacon-cheeseburger.jpeg", price: 7.99 },
    { name: "Double Cheeseburger", img: "/double-cheeseburger.jpeg", price: 8.99 },
  ]
},  
{
   category: "Desserts",
    items: [
      { name: "Vanilla Shake", img: "/vanilla-shake.jpeg", price: 3.99 },
      { name: "Chocolate Shake", img: "/chocolate-shake.jpeg", price: 3.99 },
      { name: "Strawberry Shake", img: "/strawberry-shake.jpeg", price: 3.99 },
      { name: "Sundae", img: "/sundae.jpeg", price: 4.99 },
    ]
  }
];


const CustomerView = () => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-start p-4">
      {item_category.map((category) => (
        <div key={category.category} className="grid gap-4 py-4">
          <h2 className="text-lg">{category.category}</h2>
          <div className="grid grid-cols-6 gap-4">
            {category.items.map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <img src={item.img} alt={item.name} className="w-32 h-32" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{item.name} Information</DialogTitle>
                      <DialogDescription>
                        Price: ${item.price}
                        {/* ** HERE INCLUDE THE INGREDIENTS OF THE ITEM ** */}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Quantity
                        </Label>
                        <Input
                          id="name"
                          defaultValue="1"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Add Ingredients
                        </Label>
                        <Input
                          id="username"
                          defaultValue=""
                          className="col-span-3"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <p>{item.name}</p>
                <p>${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CustomerView;
