import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { categories, itemBelongsToCategory } from '@/lib/utils';

interface MenuItem {
  name: string;
  price: number;
  ingredients: string[];
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);


  const getImageForMenuItem = (itemName: string) => {
    return `/menu-item-pics/${itemName}.jpeg`;
  };

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu/menu_items/get-all-items-and-price');
      if (res.ok) {
        const data = await res.json();
        const fetchedMenuItems = await Promise.all(data.map(async (item: any) => {
          const ingredientsRes = await fetch(`/api/menu/ingredients/${item.id}`);
          const ingredientsData = await ingredientsRes.json();
          const ingredients = ingredientsData.map((ingredient: any) => ingredient.name);
          return { name: item.name, price: item.price, ingredients };
        }));
        setMenuItems(fetchedMenuItems);
        setLoading(false);
      } else {
        throw new Error('Failed to fetch menu items');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [])

  return (
    <div className="w-full h-full flex flex-col justify-start items-center p-4">
      <div className="w-full grid grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <Card key={index} className="bg-[#500000] border-[#3C0000]">
            <CardHeader>
              <CardTitle className="text-white">{category}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-row justify-between my-1">
                    <Skeleton className="w-1/2 h-5" />
                    <Skeleton className="w-1/4 h-5" />
                  </div>
                ))
              ) : (
                menuItems.filter(item => itemBelongsToCategory(item.name, category)).map((item, index) => (
                  <div key={index} className="flex flex-row justify-between text-white">
                    <p className="font-medium">{item.name}</p>
                    <p className="pl-16">${item.price.toFixed(2)}</p>
                  </div>
                ))
              )
              }
            </CardContent>
          </Card>
        ))}
      </div>
    </div >
  );

}

export default Menu;
