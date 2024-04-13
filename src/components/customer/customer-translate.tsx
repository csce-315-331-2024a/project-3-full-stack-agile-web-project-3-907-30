"use client";
import { useEffect, useState } from 'react';
import * as React from "react"
import Select from 'react-select';


function TranslateButton({ categories, setCategories, menuItems, setMenuItems, originalMenuItems, originalCategories}) {
    const [open, setOpen] = useState(false);
    //const [value, setValue] = useState('en');
  
    const [currentLanguage, setCurrentLanguage] = useState('en');
   
  
    const translateBackToEnglish = () => {
      setMenuItems(originalMenuItems);
      setCategories(originalCategories);
    };
  
    const translateText = async (targetLanguage: string) => {
      // const targetLanguage = currentLanguage === 'en' ? 'es' : 'en';
  
      if(targetLanguage === 'en') {
        translateBackToEnglish();
        setCurrentLanguage(targetLanguage);
        return;
      }
  
      
      const translatedCategories = await Promise.all(categories.map(async (category: any) => {
        const response = await fetch('/api/customer/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: category,
            from: currentLanguage,
            to: targetLanguage,
          }),
        });
  
  
        const data = await response.json();
  
        return data.translation;
      }));

  
      
      const translatedMenuItems = await Promise.all(menuItems.map(async (item: any) => {
        const response = await fetch('/api/customer/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: item.name,
            from: currentLanguage,
            to: targetLanguage,
          }),
        });
  
        if (!response.ok) {
          console.error(`Failed to translate ${item.name} to ${targetLanguage} with status ${response.status}`);
          return item;
        }
  
        const data = await response.json();
        console.log(`Translating ${item.name} to ${data.translation}`)
        return { ...item, name: data.translation };
        
      }));

     


    
  
      setCategories(translatedCategories);
      setMenuItems(translatedMenuItems);
      setCurrentLanguage(targetLanguage);
      
    };
  
    const languageOptions = [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Español' },
      { value: 'ru', label: 'Русский' },
      { value: 'fr', label: 'Français' }, 
      { value: 'de', label: 'Deutsch' }, 
      { value: 'it', label: 'Italiano' }, 
      { value: 'pt', label: 'Português' }, 
      { value: 'zh', label: '中文' }, 
      { value: 'ja', label: '日本語' }, 
      { value: 'ar', label: 'العربية' }, 
      { value: 'hi', label: 'हिन्दी' },
    ];

    const handleChange = (selectedOption: { value: string; label: string }) => {
      translateText(selectedOption.value);
    };

    return (
      <Select
        options={languageOptions as { value: string; label: string }[]}
        onChange={handleChange}
        placeholder="Change Language..."
      />
    );
  
  
  }

  
  
  export default TranslateButton;


  // // Translate menu ingredients
  // useEffect(() => {
  //   fetch('/api/menu/menu_items/get-all-items-and-price')
  //   .then((res) => res.json())
  //   .then(async (data) => {
  //     // Get the ingredients for each item
  //     const ingredientPromises = data.map(async (item: any) => {
  //       const ingredients = await getIngredientsUsingItemID(item.id);
  //       const translatedIngredients = await Promise.all(ingredients.map((ingredient:string) => translateText(ingredient, targetLanguage));
        
  //       return {
  //         originalName: item.name,
  //         name: item.name,
  //         price: item.price,
  //         ingredients: translatedIngredients,
  //       };
  //     });
  //     // Wait for all the ingredients and translations to be fetched
  //     const items = await Promise.all(ingredientPromises);
  //     const itemsWithID = items.map((item, index) => ({
  //       ...item,
  //       id: data[index].id,
  //     }));
  //     setMenuItems(itemsWithID);
      
  //   });
  // }, []);