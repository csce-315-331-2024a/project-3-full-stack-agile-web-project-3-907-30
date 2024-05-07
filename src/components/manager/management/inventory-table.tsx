import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel
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
import { DetailedMenuItem, InventoryItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { deleteInventoryItem, deleteMenuItem } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import InventoryManagementForm from "./inventory-management-form";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function InventoryTable<TData extends InventoryItem | undefined, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [tableData, setTableData] = useState<TData[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters: filters,
        },
        onColumnFiltersChange: setFilters,
        getFilteredRowModel: getFilteredRowModel(),
    })

    useEffect(() => {
        setTableData(data);
    }, [data])

    return (
        <>
            <div className="flex items-center py-2">
                <Input
                    placeholder="Filter items by name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
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
                            <TableHead>Actions</TableHead>
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
                                    <InventoryManagementForm inventoryItem={data[index]} editMode={true} />
                                    <Button onClick={() => {
                                        deleteInventoryItem(data[index]!.id);
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
        </>
    )
}