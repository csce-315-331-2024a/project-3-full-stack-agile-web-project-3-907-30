import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

/**
 * A component to display menu items and allow users to add items to their order.
 *
 * @component
 * @returns {JSX.Element} The menu order component.
 */

// Define an interface for the order items
export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
  }
  

  interface MenuOrderProps {
    setOrderItems: (items: OrderItem[]) => void; // Callback function to update the order in the parent component
  }
  
  const MenuOrder: React.FC<MenuOrderProps> = ({ setOrderItems }) => {

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<{ [key: string]: OrderItem }>({});

  useEffect(() => {
    fetch('/api/menu/menu_items/get-all-items')
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      });
  }, []);

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


const fetchPriceAndAddToOrder = async (itemName: string, quantity: number) => {
    try {
        const response = await fetch(`/api/menu/get-price?itemName=${encodeURIComponent(String(itemName))}`);
        if (!response.ok) {
            throw new Error('Item not found or error fetching item price');
        }
        const data = await response.json();
        addToOrder(String(itemName), data.price, quantity);
    } catch (error) {
        console.error('Error fetching item price:', error);
        // Handle error (e.g., show a notification to the user)
    }
};

const addToOrder = (itemName: string, price: number, quantity: number) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder[itemName] || { name: itemName, price, quantity: 0 };
      const updatedQuantity = existingItem.quantity + quantity;
      const updatedItem = {
        name: itemName,
        price,
        quantity: updatedQuantity
      };
      const newOrder = { ...prevOrder, [itemName]: updatedItem };
      setOrderItems(Object.values(newOrder)); // This will update the order in the parent component
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
          categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-bold">{category}</h3>
              <div className="flex flex-col gap-2">
                {menuItems.filter(item => itemBelongsToCategory(item, category)).map((item) => (
                  <div key={item} className="flex justify-between items-center">
                    <span>{item}</span>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => fetchPriceAndAddToOrder(item, 1)}>+</Button>
                      <Input
                        type="number"
                        defaultValue={order[item]?.quantity ?? 0}
                        min={0}
                        // onChange={(e) => addToOrder(item, e.target.value)}
                        className="w-16"
                        />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MenuOrder;
