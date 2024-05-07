import { Button } from '@/components/ui/button';
import { DetailedMenuItem, InventoryItem } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

export const invColumns: ColumnDef<InventoryItem>[] = [
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            return (<
                Button
                variant='ghost'
                className='p-0'
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }}
            >
                Price
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>)
        }, cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div>{formatted}</div>
        }
    }, {
        accessorKey: 'fill_level',
        header: ({ column }) => {
            return (<
                Button
                variant='ghost'
                className='p-0'
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }}
            >
                Fill Level
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>)
        }
    }, {
        accessorKey: 'curr_level',
        header: ({ column }) => {
            return (<
                Button
                variant='ghost'
                className='p-0'
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }}
            >
                Current Level
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>)
        }
    }, {
        accessorKey: 'times_refilled',
        header: ({ column }) => {
            return (<
                Button
                variant='ghost'
                className='p-0'
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }}
            >
                Times Refilled
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>)
        }
    },
    {
        accessorKey: 'date_refilled',
        header: ({ column }) => {
            return (<
                Button
                variant='ghost'
                className='p-0'
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }}
            >
                Date Refilled
                <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>)
        }, cell: ({ row }) => {
            const amount = new Date(row.getValue("date_refilled"))
            const formatted = amount.toLocaleDateString();

            return <div>{formatted}</div>
        }
    },
    {
        accessorKey: 'has_dairy',
        header: 'Dairy?'
    }, {
        accessorKey: 'has_nuts',
        header: 'Nuts?'
    }, {
        accessorKey: 'has_eggs',
        header: 'Eggs?'
    }, {
        accessorKey: 'is_vegan',
        header: 'Vegan?'
    }, {
        accessorKey: 'is_halal',
        header: 'Halal?'
    },






] 