import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Account, AuthHookType } from '@/lib/types';
import { getAccountFromDatabase } from '@/lib/utils';
import MenuOrder from '@/components/employee/order-menu';
import OrderReceipt from '@/components/employee/order-receipt';

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}
const Employee = () => {
  const { account } = useAuth() as AuthHookType;
  const [fullAccount, setFullAccount] = useState<Account>();
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]); // This will store the current order items

  // Function to clear the order
  const clearOrder = () => {
    setOrderItems([]);
  };

  useEffect(() => {
    if (account) {
      setLoading(true);
      getAccountFromDatabase(account.email).then((data) => {
        setFullAccount(data);
        setLoading(false);
      });
    }
  }, [account]);

  return (
    <main className="flex w-full h-full items-start justify-start p-4">
      {fullAccount?.isEmployee ? (
        // When the user is an employee, show the order and receipt components
        <>
          <MenuOrder setOrderItems={setOrderItems} />
          <OrderReceipt items={orderItems} clearOrder={clearOrder} />
        </>
      ) : loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : (
        <h1 className="text-xl">You are unauthorized to view this page.</h1>
      )}
    </main>
  );
}

export default Employee;
