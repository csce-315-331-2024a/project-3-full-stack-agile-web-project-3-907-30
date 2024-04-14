// "use client";
import { useEffect, useState } from 'react';
import * as React from "react"
import Select from 'react-select';


// function TranslateButton({ categories, setCategories, menuItems, setMenuItems, originalMenuItems, originalCategories, allergens, setAllergens}) {
//     const [open, setOpen] = useState(false);
//     //const [value, setValue] = useState('en');
  
//     const [currentLanguage, setCurrentLanguage] = useState('en');
   
  
//     const translateBackToEnglish = () => {
//       setMenuItems(originalMenuItems);
//       setCategories(originalCategories);
//     };
  
//     const translateText = async (targetLanguage: string) => {
//       // const targetLanguage = currentLanguage === 'en' ? 'es' : 'en';
  
//       if(targetLanguage === 'en') {
//         translateBackToEnglish();
//         setCurrentLanguage(targetLanguage);
//         return;
//       }
  
      
//       const translatedCategories = await Promise.all(categories.map(async (category: any) => {
//         const response = await fetch('/api/customer/translate', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             text: category,
//             from: currentLanguage,
//             to: targetLanguage,
//           }),
//         });
  
  
//         const data = await response.json();
  
//         return data.translation;
//       }));

  
      
//       const translatedMenuItems = await Promise.all(menuItems.map(async (item: any) => {
//         const response = await fetch('/api/customer/translate', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             text: item.name,
//             from: currentLanguage,
//             to: targetLanguage,
//           }),
//         });
  
//         if (!response.ok) {
//           console.error(`Failed to translate ${item.name} to ${targetLanguage} with status ${response.status}`);
//           return item;
//         }
  
//         const data = await response.json();
//         console.log(`Translating ${item.name} to ${data.translation}`)
//         return { ...item, name: data.translation };
        
//       }));


//       const translatedAllergens = await Promise.all(allergens.map(async (allergen: any) => {
//         const response = await fetch('/api/customer/translate', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             text: allergen,
//             from: currentLanguage,
//             to: targetLanguage,
//           }),
//         });
//         const data = await response.json();
//         return data.translation;
//       }
//       ));
        

     
//       setCategories(translatedCategories);
//       setMenuItems(translatedMenuItems);
//       setCurrentLanguage(targetLanguage);
//       setAllergens(translatedAllergens);
      
//     };
  
//     const languageOptions = [
//       { value: 'en', label: 'English' },
//       { value: 'es', label: 'Español' },
//       { value: 'ru', label: 'Русский' },
//       { value: 'fr', label: 'Français' }, 
//       { value: 'de', label: 'Deutsch' }, 
//       { value: 'it', label: 'Italiano' }, 
//       { value: 'pt', label: 'Português' }, 
//       { value: 'zh', label: '中文' }, 
//       { value: 'ja', label: '日本語' }, 
//       { value: 'ar', label: 'العربية' }, 
//       { value: 'hi', label: 'हिन्दी' },
//     ];

//     const handleChange = (selectedOption: { value: string; label: string }) => {
//       translateText(selectedOption.value);
//     };

//     return (
//       <Select
//         options={languageOptions as { value: string; label: string }[]}
//         onChange={handleChange}
//         placeholder="Change Language..."
//       />
//     );
  
  
//   }

  
  
//   export default TranslateButton;



//********************************************************* */

// Translate all text on the screen to a different language

export const translateText = async (text: string, from: string, to: string) => {
  const response = await fetch('/api/customer/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      from,
      to,
    }),
  });

  const data = await response.json();
  console.log(`Translating ${text} to ${data.translation}`);
  return data.translation;
};






function TranslateButton({ allText, setAllText }) {
  const [open, setOpen] = useState(false);
  //const [value, setValue] = useState('en');

  const [currentLanguage, setCurrentLanguage] = useState('en');
 const originalAllText = React.useRef(allText);

 useEffect(() => {
  originalAllText.current = allText;
}, [allText]);
  // const translateBackToEnglish = () => {
  //   setMenuItems(originalMenuItems);
  //   setCategories(originalCategories);
  // };

  // const translateText = async (targetLanguage: string) => {
  //   if (targetLanguage === 'en') {
  //     setAllText(originalAllText.current);
  //     setCurrentLanguage(targetLanguage);
  //     return;
  //   }
  
  //   const translatedText = await Promise.all(
  //     Object.entries(allText).map(async ([key, values]) => {
  //       // Ensure values is an array
  //       if (!Array.isArray(values)) {
  //         values = [values];
  //       }
  
  //       const translatedValues = await Promise.all(
  //         (values as string[]).map(async (value: string) => {
  //           const response = await fetch('/api/customer/translate', {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify({
  //               text: value,
  //               from: currentLanguage,
  //               to: targetLanguage,
  //             }),
  //           });
  
  //           const data = await response.json();
  //           console.log(`Translating ${value} to ${data.translation}`)
  //           return data.translation;
  //         })
  //       );
  //       console.log(`Translating ${key} to ${translatedValues}`)
  //       return [key, translatedValues];
  //     })
  //   );
  //   console.log(`Translated text: ${translatedText}`);
    
  //   setCurrentLanguage(targetLanguage);
  // };

  // const translateText = async (targetLanguage: string) =>{
  //   if (targetLanguage === 'en') {
  //     setAllText(originalAllText.current);
  //     setCurrentLanguage(targetLanguage);
  //     return;
  //   }
  
  //   const translatedText: Record<string, string | string[]> = {};
  
  //   await Promise.all(
  //     Object.entries(allText).map(async ([key, value]) => {
  //       if (Array.isArray(value)) {
  //         translatedText[key] = await Promise.all(
  //           value.map(async (text) => {
  //             const response = await fetch('/api/customer/translate', {
  //               method: 'POST',
  //               headers: {
  //                 'Content-Type': 'application/json',
  //               },
  //               body: JSON.stringify({
  //                 text,
  //                 from: currentLanguage,
  //                 to: targetLanguage,
  //               }),
  //             });
  //             const data = await response.json();
  //             console.log(`Translating ${text} to ${data.translation}`);
  //             return data.translation;
  //           })
  //         );
  //       } 
        
  //       else if (key === 'menuItems') {
  //         // If the key is 'menuItems', we need to translate the ingredients of each item
  //         translatedText[key] = await Promise.all(
  //           (value as any[]).map(async (item) => {
  //             const translatedItem = { ...item };
  //             translatedItem.ingredients = await Promise.all(
  //               item.ingredients.map(async (ingredient) => {
  //                 const response = await fetch('/api/customer/translate', {
  //                   method: 'POST',
  //                   headers: {
  //                     'Content-Type': 'application/json',
  //                   },
  //                   body: JSON.stringify({
  //                     text: ingredient,
  //                     from: currentLanguage,
  //                     to: targetLanguage,
  //                   }),
  //                 });
  //                 const data = await response.json();
  //                 console.log(`Translating ${ingredient} to ${data.translation}`);
  //                 return data.translation;
  //               })
  //             );
  //             return translatedItem;
  //           })
  //         );
  //       } else {
  //         const response = await fetch('/api/customer/translate', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             text: value,
  //             from: currentLanguage,
  //             to: targetLanguage,
  //           }),
  //         });
  //         const data = await response.json();
  //         console.log(`Translating ${value} to ${data.translation}`);
  //         translatedText[key] = data.translation;
  //       }
  //     })
  //   );
  
  //   setAllText(translatedText);
  //   setCurrentLanguage(targetLanguage);
  // };

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

  const handleChange = (selectedOption: { value: string; label: string } | null, actionMeta: any) => {
    if (selectedOption) {
      translateText(selectedOption.value);
    }
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