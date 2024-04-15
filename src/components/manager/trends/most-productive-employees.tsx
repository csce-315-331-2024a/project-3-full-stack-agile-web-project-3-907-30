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
import { MostProductiveEmployeeItem } from "@/lib/types";

/**
 * Component to display the most productive employees
 * 
 * @param {MostProductiveEmployeeItem[]} data Data to display
 * @returns {JSX.Element} Most productive employees component
 * 
 * @example
 * // Display the most productive employees
 * <MostProductiveEmployees data={data} />
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