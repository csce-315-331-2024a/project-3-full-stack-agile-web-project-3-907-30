import { Button } from '@/components/ui/button';
import { DetailedMenuItem } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

export const menuColumns: ColumnDef<DetailedMenuItem>[] = [
	{
		accessorKey: 'item_name',
		header: 'Name'
	},
	{
		accessorKey: 'item_price',
		header: ({ column }) => {
			return (<
				Button
				variant='ghost'
				className='p-0'
				onClick={() => {
					column.toggleSorting(column.getIsSorted() === 'asc')
				}}
			>
				Item Price
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>)
		}
	},
	{
		accessorKey: 'times_ordered',
		header: 'Times Ordered'
	},
	{
		accessorKey: 'points',
		header: 'Points',
	},
	{
		accessorKey: 'cur_price',
		header: ({ column }) => {
			return <
				Button
				variant='ghost'
				className='p-0'
				onClick={() => {
					column.toggleSorting(column.getIsSorted() === 'asc')
				}}
			>
				Current Price
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		}
	},
	{
		accessorKey: 'seasonal_item',
		header: 'Seasonal Item'
	}
] 