import { ColumnDef } from '@tanstack/react-table';
import { PendingOrder } from "@/pages/employee/kitchen";

export const columns: ColumnDef<PendingOrder>[] = [
  {
    accessorKey: "order_date",
    header: "Date"
  }, {
    accessorKey: "order_total",
    header: "Total",
  }, {
    accessorKey: "emp_name",
    header: "Employee"
  }, {
    accessorKey: "status",
    header: "Status"
  }
]