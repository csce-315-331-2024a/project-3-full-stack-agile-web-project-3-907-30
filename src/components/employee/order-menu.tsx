// Date 
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { InventoryItem, MenuItem } from '@/lib/types';
import { toast } from '../ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Allergens } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { categories, itemBelongsToCategory } from '@/lib/utils';
import TranslateButton from '../customer/customer-translate';
import EmployeeTranslateButton from './employee-translate';

export interface OrderItem extends MenuItem {
    name: string;
    price: number;
    quantity: number;
}

interface MenuOrderProps {
    setOrderItems: (items: OrderItem[]) => void;
    clearOrder: () => void;
}

const MenuOrder: React.FC<MenuOrderProps> = ({ setOrderItems, clearOrder }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<{ [key: string]: OrderItem }>({});
    const [inputValues, setInputValues] = useState<{ [key: string]: number }>({});
    const [currentAllergens, setAllergens] = useState<Allergens>();
    const [open, setOpen] = useState<{[key: string]: boolean}>({});
    const [hoveredTab, setHoveredTab] = useState<number | null>(null);
    // TRANSLATION // 
    
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [originalMenuItems, setOriginalMenuItems] = useState<any[]>([]);
    const [translatedCategories, setTranslatedCategories] = useState<string[]>(categories);

    const itemClicked = (item: any) => {
        setSelectedItem(item);
    }

    useEffect(() => {
        fetch('/api/menu/menu_items/get-all-items')
            .then((res) => res.json())
            .then((data) => {
                setMenuItems(data);
                setLoading(false);
                const strings = data as string[];
                strings.map(row => {
                    setOpen({...open, [row]: false})
                })
            });
    }, []);

    const clearOrderAndSetOrderItems = () => {
        setOrder({}); // Reset the order state
        setInputValues({}); // Reset the input values
        clearOrder(); // Call the clearOrder prop
    };

    const fetchPriceAndAddToOrder = async (itemName: string) => {
        try {
            const quantity = inputValues[itemName] ?? 1;

            if (quantity <= 0) {
                return; // Do not add items with a quantity of 0 or less to the order
            }
            const response = await fetch(`/api/menu/${itemName}`);

            if (!response.ok) {
                throw new Error('Item not found or error fetching item price');
            }
            const data = await response.json();
            const id = data.id;
            const times_ordered = data.times_ordered;
            const price = data.price;

            if (!isNaN(price)) { // Check if the parsed price is a valid number
                await checkLowStock(id).then(rows => {
                    if (!(rows === undefined || rows.length === 0)) {
                        toast({
                            title: 'Low Stock Notification ⓘ',
                            description: (<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{(rows!.map(row => {
                                    return row.name.toUpperCase() + `\n\t- Current: ${row.curr_level}\n\t- Required: ${row.fill_level}`;
                                }).join('\n\n'))}</code>
                            </pre>)
                        });
                    }
                });
                addToOrder(id, String(itemName), price, times_ordered, quantity);
            } else {
                throw new Error('Invalid price received');
            }
        } catch (error) {
            console.error('Error fetching item price:', error);
            // Handle error (e.g., show a notification to the user)
        }
    };

    const checkLowStock = async (id: number) => {
        try {
            const res = await fetch(`/api/menu/check-stock/${id}`);

            if (!res.ok) {
                throw new Error('Item not found');
            }

            const data = await res.json() as InventoryItem[];
            return data;

        } catch (error) {
            console.error('Error fetching item price:', error);
        }
    }

    const addToOrder = (id: number, itemName: string, price: number, times_ordered: number, quantity: number) => {
        setOrder((prevOrder) => {
            const existingItem = prevOrder[itemName] || { id, name: itemName, price, times_ordered, quantity: 0 };
            const updatedQuantity = existingItem.quantity + quantity;
            const updatedItem = {
                id,
                name: itemName,
                price,
                times_ordered,
                quantity: updatedQuantity
            };
            const newOrder = { ...prevOrder, [itemName]: updatedItem };
            setOrderItems(Object.values(newOrder));
            return newOrder;
        });
    };

    const removeItemFromOrder = (itemName: string) => {
        setOrder((prevOrder) => {
            const newOrder = { ...prevOrder };
            const existingItem = newOrder[itemName];
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
                newOrder[itemName] = existingItem;
            } else {
                delete newOrder[itemName];
            }
            setOrderItems(Object.values(newOrder));
            return newOrder;
        });
    };
  
    const getAllergensForItem = async (name: string) => {
        try {
            const res = await fetch(`/api/menu/allergens/${name}`);

            if (!res.ok) {
                throw new Error('Item not found');
            }

            const data = await res.json() as Allergens;
            setAllergens(data);
        } catch (error) {
            console.error('Error getting allergens', error);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-start items-start p-4">
        <div className="glex items-center">
        <EmployeeTranslateButton categories={categories} setCategories={setTranslatedCategories}
        menuItems={menuItems} setMenuItems={setMenuItems} originalMenuItems={originalMenuItems} originalCategories={categories} />
      <span className="ml-2">🌐</span>
      </div>
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>Menu</CardTitle>
                <CardDescription>Select your items</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 h-full">
                {loading ? (
                    <div>Loading menu items...</div>
                ) : (
                    <>
                        <Button onClick={clearOrderAndSetOrderItems} className="bg-red-500 hover:bg-red-700 text-white font-bold py-8 px-2 text-lg rounded">
                            Clear Order
                        </Button>
                        <Tabs defaultValue="Burgers&Wraps" className="w-full flex flex-col gap-2 h-full">
                            <TabsList className="grid grid-cols-6 w-full h-fit">
                                {categories.map((category, index) => (
                                    <TabsTrigger
                                        key={index}
                                        value={category.replace(/\s/g, '')}
                                        className={`p-4 cursor-pointer relative`}
                                        onMouseEnter={() => setHoveredTab(index)}
                                        onMouseLeave={() => setHoveredTab(null)}
                                    >
                                        <h2>
                                            {category}
                                        </h2>
                                        {hoveredTab === index && (
                                            <div className="absolute inset-0 border-2 border-gray-300 rounded pointer-events-none transition-all duration-500"></div>
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {
                                categories.map((category) => (
                                    <TabsContent key={category} value={category.replace(/\s/g, '')} className="h-full">
                                        <div key={category} className="h-full overflow-y-scroll">
                                            <div className="grid grid-cols-4 gap-4 h-[100px]">
                                                {menuItems.filter(item => itemBelongsToCategory(item, category)).map((item) => (
                                                    <Card key={item} className="flex flex-col justify-between gap-8 items-center py-3">
                                                        <h3 className="text-center font-semibold">{item}</h3>
                                                        <div className="flex items-center gap-2">
                                                          <AlertDialog open={open[item]}>
                                                            <AlertDialogTrigger asChild>
                                                              <Button onClick={async () => {
                                                                await getAllergensForItem(item);
                                                                setOpen({...open, [item]: true});
                                                              }}>+</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                              <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Dietary Restrictions
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Dairy? {currentAllergens?.has_dairy ? "Yes" : "No"}
                                                                </AlertDialogDescription>
                                                                <AlertDialogDescription>
                                                                    Eggs? {currentAllergens?.has_eggs ? "Yes" : "No"}
                                                                </AlertDialogDescription>
                                                                <AlertDialogDescription>
                                                                    Nuts? {currentAllergens?.has_nuts ? "Yes" : "No"}
                                                                </AlertDialogDescription>
                                                                <AlertDialogDescription>
                                                                    Vegan? {currentAllergens?.is_vegan ? "Yes" : "No"}
                                                                </AlertDialogDescription>
                                                                <AlertDialogDescription>
                                                                    Halal? {currentAllergens?.is_halal ? "Yes" : "No"}
                                                                </AlertDialogDescription>
                                                              </AlertDialogHeader>
                                                              <AlertDialogFooter>
                                                                <AlertDialogCancel asChild>
                                                                    <Button onClick={() => setOpen({...open, [item]: false})} className="text-black">
                                                                        Cancel
                                                                    </Button>
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction>
                                                                    <Button onClick={() => {
                                                                        fetchPriceAndAddToOrder(item);
                                                                        setOpen({...open, [item]: false});
                                                                    }}>Confirm</Button>
                                                                </AlertDialogAction>
                                                              </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                          </AlertDialog>
                                                          <Input
                                                              type="number"
                                                              value={inputValues[item] ?? order[item]?.quantity ?? 0}
                                                              onChange={(e) => setInputValues({ ...inputValues, [item]: parseInt(e.target.value) })}
                                                              min={0}
                                                              className="w-16"
                                                          />
                                                          <Button onClick={() => removeItemFromOrder(item)}>-</Button>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                ))
                            }
                        </Tabs>
                    </>
                )}
            </CardContent >
        </Card >
        </div>
    );
};

export default MenuOrder;
