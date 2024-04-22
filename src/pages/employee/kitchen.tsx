import { columns } from "@/components/employee/kitchen/columns";
import DataTable from "@/components/employee/kitchen/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerOrder } from "@/lib/types";
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
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [items, setItems] = useState<MenuOrderPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAndSetData = (async () => {

      const orderRes = await fetch(`${process.env.URL || 'http://localhost:3000'}/api/kitchen/get-pending-orders`);
      const pendingOrders = JSON.parse(await orderRes.json()) as PendingOrder[];
      console.log(pendingOrders);

      const itemsRes = await fetch(`${process.env.URL || 'http://localhost:3000'}/api/kitchen/get-order-items`);
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
    <>
      {(loading) ? <Skeleton></Skeleton> : <DataTable columns={columns} data={orders} items={items} />}
    </>
  )
}

export default Kitchen;