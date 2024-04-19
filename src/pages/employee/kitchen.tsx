import { columns } from "@/components/employee/kitchen/columns";
import DataTable from "@/components/employee/kitchen/data-table";
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

  useEffect(() => {
    const getAndSetData = (async () => {

      const orderRes = await fetch('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/api/kitchen/get-pending-orders');
      const pendingOrders = JSON.parse(await orderRes.json()) as PendingOrder[];
      console.log(pendingOrders);

      const itemsRes = await fetch('https://project-3-full-stack-agile-web-project-3-907-30.vercel.app/api/kitchen/get-order-items');
      const itemsPairs = JSON.parse(await itemsRes.json()) as MenuOrderPair[];
      console.log(itemsPairs);

      setOrders(pendingOrders);
      setItems(itemsPairs);
    });

    getAndSetData();

    const interval = setInterval(getAndSetData, 10000);
    return () => clearInterval(interval);

  }, [])

  return (
    <>
      <DataTable columns={columns} data={orders} items={items} />
    </>
  )
}

export default Kitchen;