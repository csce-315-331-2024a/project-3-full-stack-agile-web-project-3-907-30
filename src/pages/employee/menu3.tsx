import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { categories, getEmployeeFromDatabase, itemBelongsToCategory } from '@/lib/utils';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import { AuthHookType, Employee } from '@/lib/types';

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

const MenuThree = () => {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getImageForMenuItem = (itemID: number) => {
    return `/menu-item-pics/${itemID}.jpeg`;
  };

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu/menu_items/get-all-items-and-price');
      if (res.ok) {
        const data = await res.json();
        const fetchedMenuItems = await Promise.all(data.map(async (item: any) => {
          return { id: item.id, name: item.name, price: item.price };
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

  useEffect(() => {
    if (account) {
      setLoading(true);
      getEmployeeFromDatabase(account.email).then((data) => {
        setEmployee(data);
        setLoading(false);
      });
    }
  }, [account]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center p-4">
      {employee?.isVerified ? (
        <div className="flex flex-col w-full h-full gap-2">
          <div className="w-full grid grid-cols-2 gap-4">
            {["Tenders", "Meals", "Sides", "Desserts"].map((category, index) => (
              <Card key={index} className="bg-[#500000] border-[#3C0000]">
                <CardHeader className="mb-6">
                  <CardTitle className="text-white text-5xl">{category}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-12">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <Skeleton className="w-[150px] h-[150px]" />
                        <Skeleton className="w-4/5 h-6 mt-2" />
                        <Skeleton className="w-1/2 h-5" />
                      </div>
                    ))
                  ) : (
                    menuItems.filter(item => itemBelongsToCategory(item.name, category)).map((item, index) => (
                      <div key={index} className="flex flex-col text-white items-center gap-2">
                        <Image src={getImageForMenuItem(item.id)} width={150} height={150} alt={item.name} className="rounded-lg" />
                        <p className="font-bold text-3xl mt-2 text-center">{item.name}</p>
                        <p className="text-xl">${item.price.toFixed(2)}</p>
                      </div>
                    ))
                  )
                  }
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-black text-lg w-full">Images generated with DALL-E. Prompts available if requested.</div>
        </div>
      ) : (loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : (
        <h1 className="text-xl">
          You are unauthorized to view this page.
        </h1>
      ))}
    </div >
  );

}

export default MenuThree;
