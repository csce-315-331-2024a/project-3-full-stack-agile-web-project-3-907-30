import { columns } from "@/components/employee/kitchen/columns";
import DataTable from "@/components/employee/kitchen/data-table";
import useAuth from "@/hooks/useAuth";
import { AuthHookType, CustomerOrder, Employee } from "@/lib/types";
import { getEmployeeFromDatabase } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface PendingOrder extends CustomerOrder {
  status: string;
}

export interface MenuOrderPair {
  id: number;
  name: string;
}

export interface KitchenProps {
  orders: PendingOrder[];
  items: MenuOrderPair[];
}

const Kitchen = () => {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [items, setItems] = useState<MenuOrderPair[]>([]);
  const [loading, setLoading] = useState(true);

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
    const getAndSetData = (async () => {

      const orderRes = await fetch(`http://localhost:3000/api/kitchen/get-pending-orders`);
      const pendingOrders = JSON.parse(await orderRes.json()) as PendingOrder[];
      console.log(pendingOrders);

      const itemsRes = await fetch(`http://localhost:3000/api/kitchen/get-order-items`);
      const itemsPairs = await itemsRes.json() as MenuOrderPair[];
      console.log(itemsPairs);

      setOrders(pendingOrders);
      setItems(itemsPairs);
    });

    getAndSetData();
    setLoading(false);

    const interval = setInterval(() => {
      getAndSetData();
    }, 20000);
    return () => clearInterval(interval);

  }, [])

  return (
    <main className="p-4">
      {employee?.isVerified ? (
        <DataTable columns={columns} data={orders} items={items} />
      ) : (loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : (
        <h1 className="text-xl">
          You are unauthorized to view this page.
        </h1>
      ))}
    </main>
  )
}

export default Kitchen;