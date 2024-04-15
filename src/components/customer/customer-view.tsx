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
import { Allergens } from '@/lib/types';


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
  const [currentAllergens, setAllergens] = useState<Allergens>();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  /**
   * Function to handle when an item is clicked
   * @param item - The item that was clicked.
   */
  const itemClicked = async (item: any) => {
    setSelectedItem(item);
    await getAllergensForItem(item.name);
  };


  /**
   * Function to get the ingredients for a specific item
   * @param itemID - ID of the item.
   * @returns - The ingredients for the item.
   */
  // Getting the Ingredient names using the ItemID
  const getIngredientsUsingItemID = async (itemID: number) => {
    const res = await fetch(`/api/menu/ingredients/${itemID}`)
    const data = await res.json();
    const ingredientNames = data.map((ingredient: any) => ingredient.name);
    return ingredientNames;
  };


/**
 * Function to get all the menu items and their prices.
 * @returns - The menu items and their prices.
 */
  useEffect(() => {
    fetch('/api/menu/menu_items/get-all-items-and-price')
      .then((res) => res.json())
      .then(async (data) => {
        // Get the ingredients for each item
        const ingredientPromises = data.map(async (item: any) => {
          const ingredients = await getIngredientsUsingItemID(item.id);

          return {
            originalName: item.name,
            name: item.name,
            price: item.price,
            ingredients: ingredients,
          };
        });
        // Wait for all the ingredients and translations to be fetched
        const items = await Promise.all(ingredientPromises);
        const itemsWithID = items.map((item, index) => ({
          ...item,
          id: data[index].id,
        }));
        setMenuItems(itemsWithID);
      });
  }, []);


/**
 * Function to get the image for a specific menu item
 * @param itemID - ID of the item.
 * @returns - The image URL for the menu items.
 */
  // Retrieve the image for menu item using the item ID
  const getImageForMenuItem = (itemID: number) => {
    return `/menu-item-pics/${itemID}.jpeg`;
  };


/**
 * Function to get allergens for a specific item
 * @param name - Name of the item.
 */
  const getAllergensForItem = async (name: string) => {
    try {
      const res = await fetch(`/api/menu/allergens/${name}`);

      if (!res.ok) {
        throw new Error("Item not found");
      }

      const data = (await res.json()) as Allergens;
      setAllergens(data);
    } catch (error) {
      console.error("Error getting allergens", error);
    }
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
            <Card className="overflow-y-scroll h-[90%]">
              <div className="grid grid-cols-5 gap-4 p-4 items-stretch">
                {menuItems
                  .filter((item) => itemBelongsToCategory(item.originalName, category))
                  .map((item: any) => {
                    return (
                      <div key={item.name}
                        className={`flex flex-col items-center gap-4 h-full transition-all duration-300 ease-in-out ${hoveredItem === item.name ? 'transform scale-105 shadow-lg rounded-lg' : ''}`}
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Card className="flex flex-col justify-between items-center h-full w-full p-4 gap-8 cursor-pointer" onClick={() => itemClicked(item)}>
                              <Image src={getImageForMenuItem(item.id)} alt={item.name} className="rounded-md" width={200} height={200} />
                              <div className="flex flex-col gap-2 text-lg text-center">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-base">${item.price.toFixed(2)}</p>
                              </div>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="w-[600px]">
                            <DialogHeader>{item.name}</DialogHeader>
                            <div className="grid gap-4 py-4"></div>
                            <div className="flex items-center justify-center gap-4">
                              {selectedItem &&
                                <Image src={getImageForMenuItem(selectedItem.id)} alt={selectedItem.name} className="rounded-md" width={300} height={300} />
                              }
                            </div>
                            <div className="flex items-center justify-start gap-4">
                              <Label htmlFor="name" className="text-right mt-0.5">
                                Ingredients:
                              </Label>
                              <div id="name" className="col-span-3">
                                {/* <ul className="flex flex-row gap-1 mr-3"> */}
                                <ul className="flex flex-row gap-1 mr-3 justify-center flex-wrap">
                                  {item.ingredients.map((ingredient: string) => (
                                    <li key={ingredient} className="text-sm">{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="flex items-center justify-start gap-4">
                              <Label htmlFor="allergens" className="text-right mt-0.5 text-red-500 font-bold ">
                                CONTAINS
                              </Label>
                              <div id="allergens" className="flex flex-row gap-4 justify-center flex-wrap">
                                {currentAllergens?.has_dairy && <p className="text-red-500">Dairy</p>}
                                {currentAllergens?.has_nuts && <p className="text-red-500">Nuts</p>}
                                {currentAllergens?.has_eggs && <p className="text-red-500">Eggs</p>}
                                {currentAllergens?.is_vegan && <p className="text-red-500">Vegan</p>}
                                {currentAllergens?.is_halal && <p className="text-red-500">Halal</p>}
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