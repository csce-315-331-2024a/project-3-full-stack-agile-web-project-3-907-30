import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Employee, AuthHookType } from '@/lib/types';
import { getEmployeeFromDatabase } from '@/lib/utils';
import MenuOrder, { OrderItem } from '@/components/employee/order-menu';
import OrderReceipt from '@/components/employee/order-receipt';

/**
 * The employee view page. This page is only accessible to users that are employees or managers.
 * 
 * @returns {JSX.Element} The employee view page.
 */
const EmployeeOrderPage = () => {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  useEffect(() => {
    if (account) {
      setLoading(true);
      getEmployeeFromDatabase(account.email).then((data) => {
        setEmployee(data);
        setLoading(false);
      });
    }
  }, [account]);

  return (
    <main className="flex w-full h-full items-start justify-start p-4">
      {employee ? (
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h1 className="text-xl">Welcome, {account?.name}</h1>
            <MenuOrder setOrderItems={setOrderItems} clearOrder={() => setOrderItems([])} />
          </div>
          <div>
            <OrderReceipt items={orderItems} clearOrder={() => setOrderItems([])} />
          </div>
        </div>
      ) : (loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : (
        <h1 className="text-xl">
          You are unauthorized to view this page.
        </h1>
      )
      )}
    </main>
  );
}

export default EmployeeOrderPage;
