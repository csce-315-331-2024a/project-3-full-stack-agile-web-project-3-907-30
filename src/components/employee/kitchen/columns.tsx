import { ColumnDef } from '@tanstack/react-table';
import { PendingOrder } from "@/pages/employee/kitchen";

export const columns: ColumnDef<PendingOrder>[] = [
  {
    accessorKey: "order_date",
    header: "Date",
    cell: ({ row }) => {
      const date: string = row.getValue("order_date");
      const formatted = date.substring(0, 6) + "," + date.substring(6);
      return formatted;
    }
  }, {
    accessorKey: "order_total",
    header: "Total",
    cell: ({ row }) => {
      const amt = parseFloat(row.getValue("order_total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amt);
      return formatted;
    }
  }, {
    accessorKey: "emp_name",
    header: "Employee"
  }, {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");

      switch (status) {
        case "Pending":
          return <div className='text-yellow-600'>{status}</div>;

        case "Complete":
          return <div className='text-green-600'>{status}</div>;

        case "Cancelled":
          return <div className='text-rose-700'>{status}</div>

        default:
          return status;
      }
    }
  }
]