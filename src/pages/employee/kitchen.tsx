import { columns } from "@/components/employee/kitchen/columns";
import DataTable from "@/components/employee/kitchen/data-table";
import db from "@/lib/db";
import { CustomerOrder } from "@/lib/types";
import { executeStatement } from "@/lib/utils";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { QueryResult } from "postgresql-client";

export interface PendingOrder extends CustomerOrder {
    status: "Pending" | "Complete" | "Cancelled";
}

export interface MenuOrderPair {
    id: number;
    name: string;
}

export interface KitchenProps {
    orders: PendingOrder[];
    items: MenuOrderPair[];
}

export const getServerSideProps = (async () => {
    const order_sql = `SELECT
        order_id, order_date, order_time,
        order_total::numeric, e.emp_name, used_points, status
        FROM orders AS o 
        INNER JOIN employees AS e ON o.emp_id = e.emp_id
        WHERE status = 0
        ORDER BY order_date DESC;`;

    const items_sql = `SELECT
        o.order_id, m.item_name
        FROM orders AS o
        INNER JOIN orders_menu AS om ON o.order_id = om.order_id
        INNER JOIN menu_items AS m ON om.item_id = m.item_id
        WHERE o.status = 0;`;

    // Get customer orders
    const orders = await executeStatement(db, order_sql, [], []).then((res: QueryResult) => {
        if (res.rows!.length === 0) {
            return []
        } else {
            return res.rows!.map((row: any[]) => {
                return {
                    order_id: row[0],
                    order_date: row[1].toString().substring(4, 15),
                    order_time: row[2].toString(),
                    order_total: row[3].toFixed(2),
                    emp_name: row[4],
                    used_points: row[5],
                    status: row[6] === 0 ? "Pending" : "Complete"
                } as PendingOrder;
            })
        }
    });

    // Get menu-order pairs from join table
    const items = await executeStatement(db, items_sql, [], []).then((res: QueryResult) => {
        if (res.rows!.length === 0) {
            return []
        } else {
            return res.rows!.map((row: any[]) => {
                return {
                    id: row[0],
                    name: row[1]
                } as MenuOrderPair;
            });
        }
    });

    // console.log(orders);
    // console.log(items);

    return { props: { orders, items } };
}) satisfies GetServerSideProps<KitchenProps>

const Kitchen = ({ orders, items }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <DataTable columns={columns} data={orders} />
        </>
    )
}

export default Kitchen;