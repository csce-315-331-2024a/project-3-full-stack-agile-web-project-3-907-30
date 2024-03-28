import React, { useEffect, useState } from 'react';

// Order Item types


interface MenuItem {
  name: string;
  price: number;
  ingredients: string[];
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

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
      } else {
        throw new Error('Failed to fetch menu items');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);


  const itemBelongsToCategory = (item: MenuItem, category: string) => {
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

  const categories = ["Burgers & Wraps", "Meals", "Tenders", "Sides", "Drinks", "Desserts"];

  return (
  <div className="w-full h-full flex flex-col justify-start items-center p-4">
    <h1 className="text-3xl font-bold mb-8">Menu Board</h1>
    <div className="w-full max-w-screen-lg">
      {categories.map((category, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-3 gap-8">
            {menuItems.filter(item => itemBelongsToCategory(item, category)).map((item, index) => (
              <div key={index} className="flex flex-col items-center bg-white p-4 rounded-md shadow-md">
                <img src={getImageForMenuItem(item.name)} alt={item.name} className="w-32 h-32 rounded-md mb-4" />
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default Menu;
