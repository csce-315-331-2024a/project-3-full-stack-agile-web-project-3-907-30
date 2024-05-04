import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import MenuManagementForm from './menu-management-form';
import { DetailedMenuItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { deleteMenuItem } from "@/lib/utils";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function MenuTable<TData extends DetailedMenuItem | undefined, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [tableData, setTableData] = useState<TData[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        }
    })

    useEffect(() => {
        setTableData(data);
    }, [data])

    return (
        <Table className="overflow-hidden">
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => {
                        return (<TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}

                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                            <TableCell className="flex gap-2">
                                <MenuManagementForm menuItem={data[index]} editMode={true} />
                                <Button onClick={() => {
                                    deleteMenuItem(data[index]!.item_id);
                                    data = data.filter((value) => value !== data[index]);
                                    console.log(data);
                                    setTableData(data);
                                }}>X</Button>
                            </TableCell>
                        </TableRow>)
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}