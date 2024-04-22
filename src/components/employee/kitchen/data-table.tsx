import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MenuOrderPair, PendingOrder } from "@/pages/employee/kitchen";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";

interface DataTableProps<TData, TVal> {
  columns: ColumnDef<TData, TVal>[],
  data: TData[],
  items: MenuOrderPair[]
}

function DataTable<TData, TVal>({ columns, data, items }: DataTableProps<TData, TVal>) {
  const [open, setOpen] = useState<{ [key: number]: boolean }>({});
  const [tableData, setTableData] = useState<TData[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const getListOfMenuItems = (index: number): ReactNode => {
    const filteredItems = items.filter((item) => {
      const order = data[index] as PendingOrder;
      if (order === undefined) return;
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

  const markOrder = async (status: string, url: string, index: number) => {
    const order = data[index] as PendingOrder;
    order.status = status;
    const nextTableData = data.map((value, tableIndex) => {
      if (index === tableIndex) return order as TData;
      return value;
    })

    await fetch(url + `?id=${order.order_id}`, {
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
                    <div className="flex flex-col">
                      <Button
                        className="bg-red-950 m-1"
                        onClick={async () => {
                          await markOrder("Complete", "/api/kitchen/complete-order", index);
                        }}
                      >Mark as Complete</Button>
                      <Button
                        className="bg-red-950 m-1"
                        onClick={async () => {
                          await markOrder("Cancelled", "/api/kitchen/cancel-order", index);
                        }}
                      >Cancel</Button>
                      <AlertDialog open={open[index]}>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="bg-red-950 m-1"
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
                    </div>
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