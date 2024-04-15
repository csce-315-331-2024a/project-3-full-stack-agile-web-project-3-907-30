import { Button } from "@/components/ui/button";

export default function DatePicker() {
	return (
		<div className="grid grid-flow-row grid-cols-5 grid-rows-3">
			<span className="row-start-1 col-start-2">Start Date: </span>
			<input type="date" name="" id="" className="row-start-1 col-start-4" />
			<span className="row-start-2 col-start-2">End Date: </span>
			<input type="date" name="" id="" className="row-start-2 col-start-4" />
			<Button className="row-start-3 col-span-3 col-start-2"></Button>
		</div>
	);
}