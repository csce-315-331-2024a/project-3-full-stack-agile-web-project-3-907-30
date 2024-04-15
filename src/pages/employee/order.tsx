import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Employee, AuthHookType } from '@/lib/types';
import { getEmployeeFromDatabase } from '@/lib/utils';
import MenuOrder, { OrderItem } from '@/components/employee/order-menu';
import OrderReceipt from '@/components/employee/order-receipt';
import clearOrderAndSetOrderItems from '@/components/employee/order-menu';

/**
 * Component for displaying a menu order and order receipt for an employee
 * @prop {Employee} employee - The employee object containing employee information
 * @prop {boolean} loading - A boolean indicating if the component is currently loading
 * @prop {OrderItem[]} orderItems - An array of order items for the current order
 * @prop {() => void} clearOrder - A function to clear the current order
 * @description
 *   - Uses the useAuth hook to get the current employee's account information
 *   - Uses the useEffect hook to fetch the employee's information from the database
 *   - Uses the useState hook to manage the employee, loading, order items, and clear order function
 *   - Renders a main component with a menu order and order receipt section
 */
const EmployeeOrderPage = () => {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [clearOrder, setClearOrder] = useState<() => void>(() => { });

  useEffect(() => {
    if (account) {
      setLoading(true);
      getEmployeeFromDatabase(account.email).then((data) => {
        setEmployee(data);
        setLoading(false);
      });
    }
  }, [account]);

  useEffect(() => {
    setClearOrder(() => clearOrderFunction);
  }, []);

  const clearOrderFunction = () => {
    setOrderItems([]);
  };

  return (
    <main className="flex flex-col w-full h-full items-start justify-start p-4 gap-8 max-h-full overflow-hidden">
      {employee?.isVerified ? (
        <div className="flex flex-row items-stretch w-full h-full gap-4">
          <div className="w-2/3 h-full">
            <MenuOrder setOrderItems={setOrderItems} clearOrder={clearOrderFunction} />
          </div>
          <div className="w-1/3 h-full">
            <OrderReceipt items={orderItems} clearOrder={clearOrder} />
          </div>
        </div>
      ) : (loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : (
        <h1 className="text-xl">
          You are unauthorized to view this page.
        </h1>
      ))}
    </main>
  );
}

export default EmployeeOrderPage;
