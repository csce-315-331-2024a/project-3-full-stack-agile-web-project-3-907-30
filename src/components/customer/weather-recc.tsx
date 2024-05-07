import { Allergens } from "@/lib/types";
import { Weather } from "@/pages/api/customer/weather";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card } from "../ui/card";
import Image from 'next/image';
import { Button } from "../ui/button";

interface CustomerWeatherReccsProps {
  weather: Weather
  items: any[]
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const CustomerWeatherReccs = ({ weather, items }: CustomerWeatherReccsProps) => {
  const [reccs, setReccs] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentAllergens, setAllergens] = useState<Allergens>();
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  /**
   * Function to handle when an item is clicked
   * @param item - The item that was clicked.
   */
  const itemClicked = async (item: any) => {
    setSelectedItem(item);
    await getAllergensForItem(item.name);
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

  /**
     * Function to get the image for a specific menu item
     * @param itemID - ID of the item.
     * @returns - The image URL for the menu items.
     */
  // Retrieve the image for menu item using the item ID
  const getImageForMenuItem = (itemID: number) => {
    return `/menu-item-pics/${itemID}.jpeg`;
  };

  const addItemToOrder = (item: any, quantity: number) => {
    setOrderItems((prevOrderItems) => [
      ...prevOrderItems,
      { name: item.name, price: item.price, quantity },
    ]);
  };

  

  useEffect(() => {
    const filteredItems: string[] = [];

    console.log(weather);

    // Hot (high temps)
    if (weather.value >= 80) {
      items.filter((value) => {
        const item = value.originalName;
        return item.includes('Shake') || item.includes('Drink')
          || item.includes('Water') || item.includes('Sundae')
          || item.includes('Float') || item.includes('Ice Cream');
      }).map((item) => {
        filteredItems.push(item);
      })
    }

    // Cold (cold temps)
    else if (weather.value <= 46) {
      items.filter((value) => {
        const item = value.originalName;
        return item.includes('urger') || item.includes('Melt');
      }).map((item) => {
        filteredItems.push(item);
      })
    }

    // Day (is it day?)
    if (weather.isDay && weather.value < 80) {
      items.filter((value) => {
        const item = value.originalName;
        return item.includes('Water') || item.includes('Drink') || item.includes('Wrap');
      }).map((item) => {
        filteredItems.push(item);
      })
    } else if (weather.isDay) {
      items.filter((value) => {
        const item = value.originalName;
        return item.includes('Wrap');
      }).map((item) => {
        filteredItems.push(item);
      })
    }

    // Night (is it night?)
    else if (!weather.isDay && weather.value > 46) {
      items.filter((value) => {
        const item: string = value.originalName;
        return item.includes('Melt') || item.includes('urger') || item.includes('Meal');
      }).map((item) => {
        filteredItems.push(item);
      })
    }
    setReccs(filteredItems);

  }, [weather, items])

  return (
    <>
      {reccs.length ? (
        reccs.map((item) => (
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
                                {item.onSale ? (
                                  <>
                                    <p className="text-base line-through">${item.price.toFixed(2)}</p>
                                    <p className="text-sm font-bold" style={{ color: '#b30000' }}>ON SALE! ${item.currentPrice.toFixed(2)}</p>
                                  </>
                                ) : (
                                  <p className="text-base">${item.currentPrice.toFixed(2)}</p>
                                )}
                                
                              </div>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="w-full">
                            {/* <DialogHeader>{item.name}</DialogHeader> */}
                            <DialogHeader>
                              {item.name} - ${item.onSale ? item.currentPrice.toFixed(2) : item.price.toFixed(2)}
                              {item.onSale && <span style={{ color: '#b30000', fontWeight: 'bold' }}> Item is on sale!</span>}
                            </DialogHeader>
                            <div className="grid gap-4 py-4"></div>
                            <div className="flex items-center justify-center gap-4">
                              {selectedItem &&
                                <Image src={getImageForMenuItem(selectedItem.id)} alt={selectedItem.name} className="rounded-md" width={300} height={300} />
                              }
                            </div>
                            <div className="flex items-center justify-start gap-4 mb-1">
                              <Label htmlFor="name" className="text-right mt-0.5">
                                Ingredients:
                              </Label>
                              <div id="name" className="col-span-3">
                                <ul className="flex flex-row gap-1 mr-3 justify-center flex-wrap">
                                  {item.ingredients.map((ingredient: string, index: number, array: string[]) => (
                                    <li key={ingredient} className="text-sm">
                                      {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                                      {index !== array.length - 1 && ','} 
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            {(currentAllergens?.has_dairy || currentAllergens?.has_nuts || currentAllergens?.has_eggs) && (
                              <div className="flex items-center justify-start gap-4 mb-0 py-0">
                                <Label htmlFor="allergens" className="text-right font-bold" style={{ color: '#b30000' }}>
                                  CONTAINS
                                </Label>
                                <div id="allergens" className="flex flex-row gap-4 justify-center flex-wrap">
                                  {currentAllergens?.has_dairy && <p style={{ color: '#b30000' }} className="mb-0">Dairy</p>}
                                  {currentAllergens?.has_nuts && <p style={{ color: '#b30000' }} className="mb-0">Nuts</p>}
                                  {currentAllergens?.has_eggs && <p style={{ color: '#b30000' }} className="mb-0">Eggs</p>}
                                </div>
                              </div>
                            )}
                            <div className="flex justify-end gap-3">
                              {currentAllergens?.is_vegan && <p className="text-sm font-bold mt-0 mb-0" style={{ color: '#006400' }}>VEGAN</p>}
                              {currentAllergens?.is_halal && <p className="text-sm font-bold mt-0 mb-0" style={{ color: '#000080' }}>HALAL</p>}
                            </div>

                            <DialogFooter>
                              <div className="flex items-center gap-2">
                                <Label htmlFor="quantity" className="text-right text-lg">
                                  Quantity:
                                </Label>
                                <input
                                  id="quantity"
                                  type="number"
                                  min="1"
                                  value={itemQuantity}
                                  onChange={(e) => setItemQuantity(parseInt(e.target.value, 10))}
                                  className="w-16 px-2 py-1 border border-gray-300 rounded"
                                />
                              </div>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    addItemToOrder(item, itemQuantity);
                                    setItemQuantity(1); // Reset the quantity to 1 after adding to order
                                  }}
                                  className="bg-green-500 hover:bg-green-700 text-white text-xl font-bold px-6 py-8 rounded"
                                >
                                  Add to Order
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
          </div>
        ))
      ) : (
        <p> No recommendations available right now. Check out the rest of the menu! </p>
      )}
    </>
  );
}

export default CustomerWeatherReccs;