import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PairsAndAppearance } from "@/lib/types";

/**
 * Shows the What Sells Together trend in table format.
 * 
 * @component
 * @param {PairsAndAppearance[]} data The input data holding the result of database call.
 * @returns {JSX.Element} The What Sells Together table component.
 */
const WhatSellsTogether = ({ data }: { data: PairsAndAppearance[] }) => {
    if(!data) {
        return null;
    }

    return (<>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Sales</TableHead>
                    <TableHead>Item 1</TableHead>
                    <TableHead>Item 2</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item: PairsAndAppearance) => {
                        return (
                            <TableRow key={item.appearances}>
                                <TableCell>
                                    {item.appearances}
                                </TableCell>
                                <TableCell>
                                    {item.item1}   
                                </TableCell>
                                <TableCell>
                                    {item.item2}
                                </TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
            <TableFooter>

            </TableFooter>
        </Table>

    </>);
}

export default WhatSellsTogether;