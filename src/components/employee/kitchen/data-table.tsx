import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MenuOrderPair, PendingOrder } from "@/pages/employee/kitchen";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import handler from "@/pages/api/kitchen/complete-order";
import { NextApiRequest, NextApiResponse } from "next";

interface DataTableProps<TData, TVal> {
  columns: ColumnDef<TData, TVal>[],
  data: TData[],
  items: MenuOrderPair[]
}

function DataTable<TData, TVal>({ columns, data, items }: DataTableProps<TData, TVal>) {
  const [open, setOpen] = useState<{ [key: number]: boolean }>({});
  const [tableData, setTableData] = useState<TData[]>(data);
  const router = useRouter();

  useEffect(() => {
    tableData.map((row, index) => {
      setOpen({ ...open, [index]: false });
    })
  }, [])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const getListOfMenuItems = (index: number): ReactNode => {
    const filteredItems = items.filter((item) => {
      const order = data[index] as PendingOrder;
      return order.order_id === item.id;
    })

    if (filteredItems.length === 0) {
      return (
        <AlertDialogDescription>
          This order has no items.
        </AlertDialogDescription>
      )
    }

    return (
      <>
        {filteredItems.map((item, itemIndex) => {
          return (
            <AlertDialogDescription key={itemIndex}>{item.name}</AlertDialogDescription>
          )
        })}
      </>
    )
  }

  const markOrderCompleted = async (index: number) => {
    const order = data[index] as PendingOrder;
    order.status = "Complete";
    const nextTableData = data.map((value, tableIndex) => {
      if (index == tableIndex) {
        return order as TData;
      }
      return value;
    })

    console.log(order);

    await fetch(`http://localhost:3000/api/kitchen/complete-order?id=${order.order_id}`, {
      method: 'PUT'
    });

    setTableData(nextTableData);


  }

  return (
    <div className="rounded-md border">
      <Table>
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
                );
              })}
              <TableHead>
                Actions
              </TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length
            ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      className="bg-red-950"
                      onClick={async () => {
                        await markOrderCompleted(index);
                      }}
                    >Complete</Button>
                  </TableCell>
                  <TableCell>
                    <AlertDialog open={open[index]}>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-red-950"
                          onClick={() => {
                            setOpen({ ...open, [index]: true });
                          }}
                        >View Order</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Order Details
                          </AlertDialogTitle>
                          {getListOfMenuItems(index)}
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={() => {
                              setOpen({ ...open, [index]: false });
                            }}
                          >Exit
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )
            : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div >
  )
}

export default DataTable;