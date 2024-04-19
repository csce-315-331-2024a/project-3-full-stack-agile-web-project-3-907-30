import { Allergens } from "@/lib/types";
import { Weather } from "@/pages/api/customer/weather";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Card } from "../ui/card";
import Image from 'next/image';

interface CustomerWeatherReccsProps {
	weather: Weather
	items: any[]
}

const CustomerWeatherReccs = ({ weather, items }: CustomerWeatherReccsProps) => {
	const [reccs, setReccs] = useState<any[]>([]);
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [hoveredItem, setHoveredItem] = useState(null);
	const [currentAllergens, setAllergens] = useState<Allergens>();

	/**
	 * Function to handle when an item is clicked
	 * @param item - The item that was clicked.
	 */
	const itemClicked = async (item: any) => {
		setSelectedItem(item);
		await getAllergensForItem(item.name);
	};

	/**
	 * Function to get allergens for a specific item
	 * @param name - Name of the item.
	 */
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

	/**
		 * Function to get the image for a specific menu item
		 * @param itemID - ID of the item.
		 * @returns - The image URL for the menu items.
		 */
	// Retrieve the image for menu item using the item ID
	const getImageForMenuItem = (itemID: number) => {
		return `/menu-item-pics/${itemID}.jpeg`;
	};

	useEffect(() => {
		const filteredItems: string[] = [];

		console.log(weather);

		// Hot (high temps)
		if (weather.value >= 80) {
			items.filter((value) => {
				const item = value.originalName;
				return item.includes('Shake') || item.includes('Drink')
					|| item.includes('Water') || item.includes('Sundae')
					|| item.includes('Float') || item.includes('Ice Cream');
			}).map((item) => {
				filteredItems.push(item);
			})
		}

		// Cold (cold temps)
		else if (weather.value <= 46) {
			items.filter((value) => {
				const item = value.originalName;
				return item.includes('urger') || item.includes('Melt');
			}).map((item) => {
				filteredItems.push(item);
			})
		}

		// Day (is it day?)
		if (weather.isDay && weather.value < 80) {
			items.filter((value) => {
				const item = value.originalName;
				return item.includes('Water') || item.includes('Drink') || item.includes('Wrap');
			}).map((item) => {
				filteredItems.push(item);
			})
		} else if (weather.isDay) {
			items.filter((value) => {
				const item = value.originalName;
				return item.includes('Wrap');
			}).map((item) => {
				filteredItems.push(item);
			})
		}

		// Night (is it night?)
		else if (!weather.isDay && weather.value > 46) {
			items.filter((value) => {
				const item: string = value.originalName;
				return item.includes('Melt') || item.includes('urger') || item.includes('Meal');
			}).map((item) => {
				filteredItems.push(item);
			})
		}
		setReccs(filteredItems);

	}, [weather, items])

	return (
		<>
			{reccs.length ? (
				reccs.map((item) => (
					<div key={item.name}
						className={`flex flex-col items-center gap-4 h-full transition-all duration-300 ease-in-out ${hoveredItem === item.name ? 'transform scale-105 shadow-lg rounded-lg' : ''}`}
						onMouseEnter={() => setHoveredItem(item.name)}
						onMouseLeave={() => setHoveredItem(null)}>
						<Dialog>
							<DialogTrigger asChild>
								<Card className="flex flex-col justify-between items-center h-full w-full p-4 gap-8 cursor-pointer" onClick={() => itemClicked(item)}>
									<Image src={getImageForMenuItem(item.id)} alt={item.name} className="rounded-md" width={200} height={200} />
									<div className="flex flex-col gap-2 text-lg text-center">
										<p className="font-semibold">{item.name}</p>
										<p className="text-base">${item.price.toFixed(2)}</p>
									</div>
								</Card>
							</DialogTrigger>
							<DialogContent className="w-[600px]">
								<DialogHeader>{item.name}</DialogHeader>
								<div className="grid gap-4 py-4"></div>
								<div className="flex items-center justify-center gap-4">
									{selectedItem &&
										<Image src={getImageForMenuItem(selectedItem.id)} alt={selectedItem.name} className="rounded-md" width={300} height={300} />
									}
								</div>
								<div className="flex items-center justify-start gap-4">
									<Label htmlFor="name" className="text-right mt-0.5">
										Ingredients:
									</Label>
									<div id="name" className="col-span-3">
										{/* <ul className="flex flex-row gap-1 mr-3"> */}
										<ul className="flex flex-row gap-1 mr-3 justify-center flex-wrap">
											{item.ingredients.map((ingredient: string) => (
												<li key={ingredient} className="text-sm">{ingredient}</li>
											))}
										</ul>
									</div>
								</div>
								<div className="flex items-center justify-start gap-4">
									<Label htmlFor="allergens" className="text-right mt-0.5 text-red-500 font-bold ">
										CONTAINS
									</Label>
									<div id="allergens" className="flex flex-row gap-4 justify-center flex-wrap">
										{currentAllergens?.has_dairy && <p className="text-red-500">Dairy</p>}
										{currentAllergens?.has_nuts && <p className="text-red-500">Nuts</p>}
										{currentAllergens?.has_eggs && <p className="text-red-500">Eggs</p>}
										{currentAllergens?.is_vegan && <p className="text-red-500">Vegan</p>}
										{currentAllergens?.is_halal && <p className="text-red-500">Halal</p>}
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				))
			) : (
				<h1>No items to display right now. Check out our menu!</h1 >
			)}
		</>
	)

}

export default CustomerWeatherReccs;