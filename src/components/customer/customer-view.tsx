
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


export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface MenuOrderProps {
  setOrderItems: (items: OrderItem[]) => void;
 
}

const CustomerView = () => {

  
    const [inputValues, setInputValues] = useState<{ [key: string]: number }>({});

  // This gets the menu item names I need
useEffect(() => {
  fetch('/api/menu/menu_items/get-all-items')
      .then((res) => res.json())
      .then((data) => {
          setMenuItems(data);
          
      });
}, []);


const getImageForMenuItem = (itemName: string) => {
  // Retrieve the image for the the menu Item
  return `/menu-item-pics/${itemName}.jpeg`;
};




// Seperate the items to their own categories
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
// This 
// const fetchPriceAndAddToOrder = async (itemName: string) => {
//   try {
//       const quantity = inputValues[itemName] ?? 1;

//       if (quantity <= 0) {
//           return; // Do not add items with a quantity of 0 or less to the order
//       }
//       const response = await fetch(`/api/menu/menu_items/get-item-price?itemName=${itemName}`);
  
//       if (!response.ok) {
//           throw new Error('Item not found or error fetching item price');
//       }
//       const data = await response.json();
//       const price = parseFloat(data.price.replace('$', '')); // remove the $ sign from the price
  
      
//   } catch (error) {
//       console.error('Error fetching item price:', error);
//       // Handle error (e.g., show a notification to the user)
//   }
// };


const [menuItems, setMenuItems] = useState([]);

const fetchMenuItemData = async (id: string) => {
  try {
      const response = await fetch(`/api/menu/ingredients/${id}`);
      if (!response.ok) {
          throw new Error('Error fetching menu item data');
      }
      return await response.json();
      setMenuItems(data);
  } catch (error) {
      console.error('Error fetching menu item data:', error);
      // Handle error (e.g., show a notification to the user)
  }

};

useEffect(() => {
  fetchMenuItemData('/api/menu/ingredients/[id].ts');
}, []);


const categories = ["Burgers & Wraps", "Meals", "Tenders", "Sides", "Drinks", "Desserts"];


// categories.map((category) => (
//   <div key={category}>
//       <h3 className="text-lg font-bold">{category}</h3>
//       <div className="flex flex-col gap-2">
//           {menuItems.filter(item => itemBelongsToCategory(item, category)).map((item) => (
//               <div key={item} className="flex justify-between items-center">
//                   <span>{item}</span>
//                   <div className="flex items-center gap-2">
//                   <Button onClick={() => fetchPriceAndAddToOrder(item)}>+</Button>
//                   <Input
//                       type="number"
//                       value={inputValues[item] ?? order[item]?.quantity ?? 0}
//                       onChange={(e) => setInputValues({ ...inputValues, [item]: parseInt(e.target.value) })}
//                       min={0}
//                       className="w-16"
//                   />
//                   </div>
//               </div>
//           ))}
//       </div>
//   </div>
// )



  return (
    <div className="w-full h-full flex flex-col justify-start items-start p-4">
      {/* This is the main container for the menu items */}
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-lg">{category}</h2>
          <div className="bg-white p-4 rounded-md border-black">
            <div className="grid grid-cols-6 gap-x-12 gap-y-80">
              {menuItems
                .filter((item) => itemBelongsToCategory(item, category))
                .map((item) => (
                  <div key={item} className="flex flex-col items-center gap-4">


            
                    <Dialog>
                      <DialogTrigger asChild>

                      <Button variant="outline">
                      <img src={getImageForMenuItem(item)} alt={item} className="w-48 h-48 rounded-md" />
                    </Button>


                      </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader></DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Quantity
                            </Label>
                            <Input id="name" defaultValue="1" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Add Ingredients
                            </Label>
                            <Input id="username" defaultValue="" className="col-span-3" />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
        
export default CustomerView;



