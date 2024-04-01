
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
import Image from 'next/image';




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
    return ingredientNames;
  };


  useEffect(() => {
    fetch('/api/menu/menu_items/get-all-items-and-price')
      .then((res) => res.json())
      .then((data) => {
        // Get the ingredients for each item
        const ingredientPromises = data.map((item:any) =>
          getIngredientsUsingItemID(item.id).then((ingredients) => ({
            name: item.name,
            price: item.price,
            ingredients: ingredients,
          }))
        );
        // Wait for all the ingredients to be fetched
        Promise.all(ingredientPromises).then((items) => {
          setMenuItems(items);
        });
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
    <div style={{backgroundColor: "#5a0000 "}} className=" w-full h-full flex flex-col justify-center items-center p-4">
      <h1 className="text-2xl flex-col items-center text-white font-bold"> Ordering Menu</h1>
      {categories.map((category, index) => (
        <div key={index} className="flex flex-col items-center">
          <h2 className="text-lg text-white">{category}</h2>
          <div className="bg-white p-1 rounded-md border-white border-4 ">
            <div style={{marginTop: '100px' }} className="grid grid-cols-6 gap-x-12 gap-y-16">
              {menuItems
                .filter((item) => itemBelongsToCategory(item, category))
                .map((item: any) => {
                  return (
                    <div key={item.name} className="flex flex-col items-center gap-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" style={{ backgroundColor: 'transparent', border: 'none'}} onClick={() => itemClicked(item)}>
                            <Image src={getImageForMenuItem(item.name)} alt={item.name} className="rounded-md" width={200} height={200} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent style={{ width: '600px', height: '600px' }}>
                          <DialogHeader></DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-center gap-4">
                              {selectedItem &&
                                <Image src={getImageForMenuItem(selectedItem.name)} alt={selectedItem.name} className="rounded-md" width={400} height={400} />
                              }
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right mr-4">
                                Ingredients:
                              </Label>
                              <div id="name" className="col-span-3">
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
                      <p style={{ marginTop: '80px' }}>{item.name}</p>
                      <p style={{ marginBottom: '60px' }}> {item.price}</p>
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



