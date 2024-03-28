
import { Button } from '@/components/ui/button';
import React, { use, useEffect } from 'react';
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
import { useState } from 'react';
import { set } from 'zod';



// Order Item types
export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}


const CustomerView = () => {

// State for the Menu Items
const [menuItems, setMenuItems] = useState<any[]>([]);
// State for the Ingredients
const [ingredients, setIngredients] = useState<any[]>([]);


// State for when an Item is Clicked
const [selectedItem, setSelectedItem] = useState<any>(null);

const itemClicked = (item: any) => {
  setSelectedItem(item);
};


// Getting the Ingredient names using the ItemID
const getIngredientsUsingItemID = async (itemID: number) =>  {
  const res = await fetch(`/api/menu/ingredients/${itemID}`)
    const data = await res.json();
    const ingredientNames = data.map((ingredient: any) => ingredient.name);
    console.log(ingredientNames);
    return ingredientNames;
};

// Fetching the Menu Items and their prices
useEffect(() => {
  fetch('/api/menu/menu_items/get-all-items-and-price')
      .then((res) => res.json())
      .then(async (data) => {
          const newMenuItems = [];
          for (const item of data) {
              const ingredients = await getIngredientsUsingItemID(item.id);
              newMenuItems.push({name: item.name, price: item.price, ingredients: ingredients});
          }
          setMenuItems(newMenuItems);
      });
}, []);

// Retrieve the image for the the menu Item
const getImageForMenuItem = (itemName: string) => {
  return `/menu-item-pics/${itemName}.jpeg`;
};


// Seperate the items to their own categories
  const itemBelongsToCategory = (item: any, category: string) => {
    switch (category) {
        case "Burgers & Wraps":
            return item.name.includes("Burger") || item.name.includes("Sandwich") || item.name.includes("Cheeseburger")
                || item.name.includes("Hamburger") || item.name.includes("Melt") || item.name.includes("Club")
                || item.name.includes("Wrap");
        case "Meals":
            return item.name.includes("Meal");
        case "Tenders":
            return item.name.includes("Tender");
        case "Sides":
            return item.name === "French Fries";
        case "Drinks":
            return item.name.includes("Shake") || item.name.includes("Water") || item.name.includes("Drink");
        case "Desserts":
            return item.name.includes("Sundae") || item.name.includes("Ice Cream") || item.name.includes("Float");
        default:
            return false;
    }
};

// Placing all the items in their respective categories
const categories = ["Burgers & Wraps", "Meals", "Tenders", "Sides", "Drinks", "Desserts"];

  return (
    <div className="w-full h-full flex flex-col justify-start items-start p-4">
      <h1 className="text-2xl flex-col items-center"> Ordering Menu</h1>
      {categories.map((category, index) => (
        <div className="flex flex-col items-center">
          <h2 className="text-lg">{category}</h2>
          <div className="bg-white p-4 rounded-md border-black">
            <div style={{marginTop: '100px' }} className="grid grid-cols-6 gap-x-12 gap-y-16">
              
              {menuItems
                .filter((item) => itemBelongsToCategory(item, category))
                .map((item: any) => {
                  return (
                  <div key={item.name} className="flex flex-col items-center gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" style={{backgroundColor: 'transparent', border: 'none'}} onClick={() => itemClicked(item)}>
                          <img src={getImageForMenuItem(item.name)} alt={item.name} className="w-48 h-42 rounded-md" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent style={{width: '600px', height: '600px'}}>
                        <DialogHeader></DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center justify-center gap-4">
                          {selectedItem &&
                          <img src={getImageForMenuItem(selectedItem.name)} alt={selectedItem.name} className="w-96 h-96 rounded-md" />
                          }
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right mr-4">
                              Ingredients:
                            </Label>
                            <div id="name" className="col-span-3">
                              {/* {item.ingredients.join(', ')} */}
                              <ul className="flex flex-row gap-1 mr-3">
                                {item.ingredients.map((ingredient: string) => (
                                  <li key={ingredient} className="text-sm">{ingredient}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <p style={{marginTop: '40px'}}>{item.name}</p>
                    <p style={{marginBottom: '50px'}}> {item.price}</p>
                  </div>)
                })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
        
export default CustomerView;



