
import React, { useEffect } from 'react';
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
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { categories, itemBelongsToCategory } from '@/lib/utils';

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const CustomerView = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);


  const itemClicked = (item: any) => {
    setSelectedItem(item);
  };

  // Getting the Ingredient names using the ItemID
  const getIngredientsUsingItemID = async (itemID: number) => {
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
        const ingredientPromises = data.map((item: any) =>
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

  return (
    <div className="w-full h-full flex flex-col justify-start items-start p-4">
      <Tabs defaultValue="Burgers&Wraps" className="w-full flex flex-row gap-2 h-full">
        <TabsList className="grid grid-cols-1 w-1/5 mt-2 h-fit">
          {categories.map((category, index) => (
            <TabsTrigger 
            key={index} 
            value={category.replace(/\s/g, '')} 
            className={`px-8 py-9 cursor-pointer relative`}
            onMouseEnter={() => setHoveredTab(index)}
            onMouseLeave={() => setHoveredTab(null)}
          >
              <h2 className="text-2xl">
                {category}
              </h2>
              {hoveredTab === index && (
                <div className="absolute inset-0 border-2 border-gray-300 rounded pointer-events-none transition-all duration-500"></div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category, index) => (
          <TabsContent key={index} value={category.replace(/\s/g, '')} className="w-4/5">
            <Card className="overflow-y-scroll h-full">
              <div className="grid grid-cols-5 gap-4 p-4 items-stretch">
                {menuItems
                  .filter((item) => itemBelongsToCategory(item.name, category))
                  .map((item: any) => {
                    return (
                      <div key={item.name}
                      className={`flex flex-col items-center gap-4 h-full transition-transform transition-shadow duration-300 ease-in-out ${hoveredItem === item.name ? 'transform scale-105 shadow-lg' : ''}`}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <Card className="flex flex-col justify-between items-center h-full w-full p-4 gap-8 cursor-pointer" onClick={() => itemClicked(item)}>
                              <Image src={getImageForMenuItem(item.name)} alt={item.name} className="rounded-md" width={200} height={200} />
                              <div className="flex flex-col gap-2 text-lg text-center">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-base">${item.price.toFixed(2)}</p>
                              </div>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="w-[600px]">
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
                      </div>)
                  })}
              </div>
            </Card>
          </TabsContent>
        ))
        }
      </Tabs>
    </div>
  );
}

export default CustomerView;
