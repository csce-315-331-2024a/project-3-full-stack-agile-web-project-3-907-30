import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MostProductiveEmployeeItem } from "@/lib/types";

/**
 * Displays a table of the most productive employees based on their total number of orders.
 * @component
 * @example
 *   <MostProductiveEmployeesTable data={sample_data} />
 * @prop {MostProductiveEmployeeItem[]} data - An array of objects containing information about the most productive employees.
 * @description
 *   - Uses the data prop to map through the array and display the employee name and total orders in a table.
 *   - Uses the id, name, and total_orders properties from each object in the data array.
 *   - Does not have any lifecycle methods.
 *   - Renders a Table component from the Material-UI library.
 */
const MostProductiveEmployees = ({ data }: { data: MostProductiveEmployeeItem[] }) => {
  return (<>
    <Table className="overflow-hidden">
      <TableHeader>
        <TableRow>
          <TableHead>Employee Name</TableHead>
          <TableHead>Total Orders</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          data.map((item: MostProductiveEmployeeItem) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  {item.name}
                </TableCell>
                <TableCell>
                  {item.total_orders}
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

export default MostProductiveEmployees;