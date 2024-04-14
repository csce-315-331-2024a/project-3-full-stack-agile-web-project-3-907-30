// import React, { useEffect } from 'react';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { useState } from 'react';
// import Image from 'next/image';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// import { Card } from '../ui/card';
// import { categories, itemBelongsToCategory } from '@/lib/utils';
// import TranslateButton from './customer-translate';
// import { Allergens } from '@/lib/types';


// export interface OrderItem {
//   name: string;
//   price: number;
//   quantity: number;
// }

// const CustomerView = () => {
//   const [menuItems, setMenuItems] = useState<any[]>([]);
//   const [ingredients, setIngredients] = useState<any[]>([]);
//   const [selectedItem, setSelectedItem] = useState<any>(null);
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [hoveredTab, setHoveredTab] = useState<number | null>(null);
//   const [originalMenuItems, setOriginalMenuItems] = useState<any[]>([]);
//   const [translatedCategories, setTranslatedCategories] = useState<string[]>(categories);
//   const [currentAllergens, setAllergens] = useState<Allergens>();
//   const [allText, setAllText] = useState<Record<string, string>>({});


//   const itemClicked = async (item: any) => {
//     setSelectedItem(item);
//     await getAllergensForItem(item.name);
//   };

//   // Getting the Ingredient names using the ItemID
//   const getIngredientsUsingItemID = async (itemID: number) => {
//     const res = await fetch(`/api/menu/ingredients/${itemID}`)
//     const data = await res.json();
//     const ingredientNames = data.map((ingredient: any) => ingredient.name);
//     return ingredientNames;
//   };


//   useEffect(() => {
//     fetch('/api/menu/menu_items/get-all-items-and-price')
//       .then((res) => res.json())
//       .then(async (data) => {
//         // Get the ingredients for each item
//         const ingredientPromises = data.map(async (item: any) => {
//           const ingredients = await getIngredientsUsingItemID(item.id);
          
//           return {
//             originalName: item.name,
//             name: item.name,
//             price: item.price,
//             ingredients: ingredients,
//           };
//         });
//         // Wait for all the ingredients and translations to be fetched
//         const items = await Promise.all(ingredientPromises);
//         const itemsWithID = items.map((item, index) => ({
//           ...item,
//           id: data[index].id,
//         }));
//         setMenuItems(itemsWithID);
//         setOriginalMenuItems(itemsWithID);

//         setAllText(prevState => ({
//           ...prevState,
//           menuItems: itemsWithID.map((item) => item.name).join(' '),
//           categories: categories.join(' '),
//         }));
//       });
//   }, []);


//   // Retrieve the image for menu item using the item ID
//   const getImageForMenuItem = (itemID: number) => {
//     return `/menu-item-pics/${itemID}.jpeg`;
//   };

//   const getAllergensForItem = async (name: string) => {
//     try {
//       const res = await fetch(`/api/menu/allergens/${name}`);

//       if (!res.ok) {
//         throw new Error("Item not found");
//       }

//       const data = (await res.json()) as Allergens;
//       setAllergens(data);
//     } catch (error) {
//       console.error("Error getting allergens", error);
//     }
//   };

//   return (
//     <div className="w-full h-full flex flex-col justify-start items-start p-4">
//       <div className="flex items-center">
//        {/* <TranslateButton categories={categories} setCategories={setTranslatedCategories}
//       menuItems={menuItems} setMenuItems={setMenuItems} originalMenuItems={originalMenuItems} originalCategories={categories}
//       allergens={currentAllergens} setAllergens={setAllergens}
//       />  */}
//       <TranslateButton allText={allText} setAllText={setAllText} />
//       {/*<TranslateButton setAllText={setAllText} />*/}
//       <span className="ml-2">🌐</span>
//       </div>
//       <Tabs defaultValue="Burgers&Wraps" className="w-full flex flex-row gap-2 h-full">
//         <TabsList className="grid grid-cols-1 w-1/5 mt-2 h-fit">
//           {categories.map((category, index) => (
//             <TabsTrigger
//               key={index}
//               value={category.replace(/\s/g, '')}
//               className={`px-8 py-9 cursor-pointer relative`}
//               onMouseEnter={() => setHoveredTab(index)}
//               onMouseLeave={() => setHoveredTab(null)}
//             >
//               <h2 className="text-2xl">
//                 {translatedCategories[index]}
//               </h2>
//               {hoveredTab === index && (
//                 <div className="absolute inset-0 border-2 border-gray-300 rounded pointer-events-none transition-all duration-500"></div>
//               )}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//         {categories.map((category, index) => (
//           <TabsContent key={index} value={category.replace(/\s/g, '')} className="w-4/5">
//             <Card className="overflow-y-scroll h-full">
//               <div className="grid grid-cols-5 gap-4 p-4 items-stretch">
//                 {menuItems
//                   .filter((item) => itemBelongsToCategory(item.originalName, category))
//                   .map((item: any) => {
//                     return (
//                       <div key={item.name}
//                         className={`flex flex-col items-center gap-4 h-full transition-all duration-300 ease-in-out ${hoveredItem === item.name ? 'transform scale-105 shadow-lg rounded-lg' : ''}`}
//                         onMouseEnter={() => setHoveredItem(item.name)}
//                         onMouseLeave={() => setHoveredItem(null)}>
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Card className="flex flex-col justify-between items-center h-full w-full p-4 gap-8 cursor-pointer" onClick={() => itemClicked(item)}>
//                               <Image src={getImageForMenuItem(item.id)} alt={item.name} className="rounded-md" width={200} height={200} />
//                               <div className="flex flex-col gap-2 text-lg text-center">
//                                 <p className="font-semibold">{item.name}</p>
//                                 <p className="text-base">${item.price.toFixed(2)}</p>
//                               </div>
//                             </Card>
//                           </DialogTrigger>
//                           <DialogContent className="w-[600px]">
//                             <DialogHeader>{item.name}</DialogHeader>
//                             <div className="grid gap-4 py-4"></div>
//                               <div className="flex items-center justify-center gap-4">
//                                 {selectedItem &&
//                                   <Image src={getImageForMenuItem(selectedItem.id)} alt={selectedItem.name} className="rounded-md" width={300} height={300} />
//                                 }
//                               </div>
//                               <div className="flex items-center justify-start gap-4">
//                                 <Label htmlFor="name" className="text-right mt-0.5">
//                                   Ingredients:
//                                 </Label>
//                                 <div id="name" className="col-span-3">
//                                   {/* <ul className="flex flex-row gap-1 mr-3"> */}
//                                   <ul className="flex flex-row gap-1 mr-3 justify-center flex-wrap">
//                                     {item.ingredients.map((ingredient: string) => (
//                                       <li key={ingredient} className="text-sm">{ingredient}</li>
//                                     ))}
//                                   </ul>
//                                 </div>
//                               </div>
//                               <div className="flex items-center justify-start gap-4">
//                                     <Label htmlFor="allergens" className="text-right mt-0.5 text-red-500 font-bold ">
//                                       CONTAINS
//                                     </Label>
//                                     <div id="allergens" className="flex flex-row gap-4 justify-center flex-wrap">
//                                       {currentAllergens?.has_dairy && <p className="text-red-500">Dairy</p>}
//                                       {currentAllergens?.has_nuts && <p className="text-red-500">Nuts</p>}
//                                       {currentAllergens?.has_eggs && <p className="text-red-500">Eggs</p>}
//                                       {currentAllergens?.is_vegan && <p className="text-red-500">Vegan</p>}
//                                       {currentAllergens?.is_halal && <p className="text-red-500">Halal</p>}
//                                   </div>
//                                   </div>
//                           </DialogContent>
//                         </Dialog>
//                       </div>)
//                   })}
//               </div>
//             </Card>
//           </TabsContent>
//         ))
//         }
//       </Tabs>
//     </div>
//   );
// }

// export default CustomerView;
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { categories, itemBelongsToCategory } from '@/lib/utils';
import TranslateButton from './customer-translate';
import { Allergens } from '@/lib/types';
import { translateText } from'./customer-translate';

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
  const [originalMenuItems, setOriginalMenuItems] = useState<any[]>([]);
  const [translatedCategories, setTranslatedCategories] = useState<string[]>(categories);
  const [currentAllergens, setAllergens] = useState<Allergens>();
  const [allText, setAllText] = useState<Record<string, string | string[]>>({
    menuItems: [],
    categories: [],
    allergens: [],
  });

  const itemClicked = async (item: any) => {
    setSelectedItem(item);
    await getAllergensForItem(item.name);
  };


  // // translate the ingredients
  // const translatedIngredients = async (targetLanguage: string) => {
  //   const translatedIngredients = await Promise.all(ingredients.map(ingredient => translatedIngredients(ingredient, targetLanguage)));
  //   return translatedIngredients;
  // }





  // Getting the Ingredient names using the ItemID
  // const getIngredientsUsingItemID = async (itemID: number) => {
  //   const res = await fetch(`/api/menu/ingredients/${itemID}`);
  //   const data = await res.json();
  //   const ingredientNames = data.map((ingredient: any) => ingredient.name);
  //   return ingredientNames;
  // };


  // getting the ingredient names using item id then trasnlating them
  const getIngredientsUsingItemID = async (itemID: number, from: string, to: string) => {
    const res = await fetch(`/api/menu/ingredients/${itemID}`);
    const data = await res.json();
    const ingredientNames = await Promise.all(data.map(async (ingredient: any) => {
      const translatedIngredient = await translateText(ingredient.name, from, to);
      return translatedIngredient;
    }));
    return ingredientNames;
  };

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
        setOriginalMenuItems(itemsWithID);

        setAllText((prevState) => ({
          ...prevState,
          menuItems: itemsWithID.map((item) => item.name),
          categories: categories,
          allergens: currentAllergens
            ? [
                currentAllergens.has_dairy ? 'Dairy' : '',
                currentAllergens.has_nuts ? 'Nuts' : '',
                currentAllergens.has_eggs ? 'Eggs' : '',
                currentAllergens.is_vegan ? 'Vegan' : '',
                currentAllergens.is_halal ? 'Halal' : '',
              ].filter(Boolean)
            : [],
        }));
      });
  }, []);

  // Retrieve the image for menu item using the item ID
  const getImageForMenuItem = (itemID: number) => {
    return `/menu-item-pics/${itemID}.jpeg`;
  };

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
      <div className="flex items-center">
        <TranslateButton allText={allText} setAllText={setAllText} />
        <span className="ml-2">🌐</span>
      </div>
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
              <h2 className="text-2xl">{allText.categories[index]}</h2>
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
                  .filter((item) => itemBelongsToCategory(item.originalName, category))
                  .map((item: any) => (
                    <div
                      key={item.name}
                      className={`flex flex-col items-center gap-4 h-full transition-all duration-300 ease-in-out ${
                        hoveredItem === item.name ? 'transform scale-105 shadow-lg rounded-lg' : ''
                      }`}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card
                            className="flex flex-col justify-between items-center h-full w-full p-4 gap-8 cursor-pointer"
                            onClick={() => itemClicked(item)}
                          >
                            <Image
                              src={getImageForMenuItem(item.id)}
                              alt={allText.menuItems[menuItems.findIndex((i) => i.name === item.name)]}
                              className="rounded-md"
                              width={200}
                              height={200}
                            />
                            <div className="flex flex-col gap-2 text-lg text-center">
                              <p className="font-semibold">{allText.menuItems[menuItems.findIndex((i) => i.name === item.name)]}</p>
                              <p className="text-base">${item.price.toFixed(2)}</p>
                            </div>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="w-[600px]">
                          <DialogHeader>{allText.menuItems[menuItems.findIndex((i) => i.name === item.name)]}</DialogHeader>
                          <div className="grid gap-4 py-4"></div>
                          <div className="flex items-center justify-center gap-4">
                            {selectedItem && (
                              <Image
                                src={getImageForMenuItem(selectedItem.id)}
                                alt={allText.menuItems[menuItems.findIndex((i) => i.name === selectedItem.name)]}
                                className="rounded-md"
                                width={300}
                                height={300}
                              />
                            )}
                          </div>
                          <div className="flex items-center justify-start gap-4">
                            <Label htmlFor="name" className="text-right mt-0.5">
                              Ingredients:
                            </Label>
                            <div id="name" className="col-span-3">
                              <ul className="flex flex-row gap-1 mr-3 justify-center flex-wrap">
                                {item.ingredients.map((ingredient: string) => (
                                  <li key={ingredient} className="text-sm">
                                    {ingredient}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center justify-start gap-4">
                            <Label
                              htmlFor="allergens"
                              className="text-right mt-0.5 text-red-500 font-bold "
                            >
                              CONTAINS
                            </Label>
                            <div id="allergens" className="flex flex-row gap-4 justify-center flex-wrap">
                              {allText.allergens.includes('Dairy') && <p className="text-red-500">Dairy</p>}
                              {allText.allergens.includes('Nuts') && <p className="text-red-500">Nuts</p>}
                              {allText.allergens.includes('Eggs') && <p className="text-red-500">Eggs</p>}
                              {allText.allergens.includes('Vegan') && <p className="text-red-500">Vegan</p>}
                              {allText.allergens.includes('Halal') && <p className="text-red-500">Halal</p>}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CustomerView;