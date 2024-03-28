import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { clear } from 'console';
import { ScrollArea } from '../ui/scroll-area';
import { InventoryItem, MenuItem } from '@/lib/types';
import { toast } from '../ui/use-toast';

export interface OrderItem extends MenuItem {
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

    useEffect(() => {
        fetch('/api/menu/menu_items/get-all-items')
            .then((res) => res.json())
            .then((data) => {
                setMenuItems(data);
                setLoading(false);
            });
    }, []);

    const clearOrderAndSetOrderItems = () => {
        setOrder({}); // Reset the order state
        setInputValues({}); // Reset the input values
        clearOrder(); // Call the clearOrder prop
    };


    const categories = ["Burgers & Wraps", "Meals", "Tenders", "Sides", "Drinks", "Desserts"];

    const itemBelongsToCategory = (item: string | string[], category: string) => {
        switch (category) {
            case "Burgers & Wraps":
                return item.includes("Burger") || item.includes("Sandwich") || item.includes("Cheeseburger")
                    || item.includes("Hamburger") || item.includes("Melt") || item.includes("Club")
                    || item.includes("Wrap");
            case "Meals":
                return item.includes("Meal");
            case "Tenders":
                return item.includes("Tender");
            case "Sides":
                return item === "French Fries";
            case "Drinks":
                return item.includes("Shake") || item.includes("Water") || item.includes("Drink");
            case "Desserts":
                return item.includes("Sundae") || item.includes("Ice Cream") || item.includes("Float");
            default:
                return false;
        }
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



    return (
        <Card>
            <CardHeader>
                <CardTitle>Menu</CardTitle>
                <CardDescription>Select your items</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {loading ? (
                    <div>Loading menu items...</div>
                ) : (
                    <ScrollArea className="h-[500px] pr-4">
                        {
                            categories.map((category) => (
                                <div key={category}>
                                    <h3 className="text-lg font-bold">{category}</h3>
                                    <div className="flex flex-col gap-2">
                                        {menuItems.filter(item => itemBelongsToCategory(item, category)).map((item) => (
                                            <div key={item} className="flex justify-between items-center">
                                                <span>{item}</span>
                                                <div className="flex items-center gap-2">
                                                    <Button onClick={() => fetchPriceAndAddToOrder(item)}>+</Button>
                                                    <Input
                                                        type="number"
                                                        value={inputValues[item] ?? order[item]?.quantity ?? 0}
                                                        onChange={(e) => setInputValues({ ...inputValues, [item]: parseInt(e.target.value) })}
                                                        min={0}
                                                        className="w-16"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        }
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
};

export default MenuOrder;
