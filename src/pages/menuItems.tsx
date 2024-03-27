import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { MenuItem } from '@/lib/types';
import { getAllMenuItems, getItemIngredients } from '@/lib/utils';
import Link from 'next';

export const getServerSideProps = (async () => {
    const menuItems: MenuItem[] = await getAllMenuItems();
    return { props: { menuItems } };
}) satisfies GetServerSideProps<{ menuItems: MenuItem[] }>;

const menuItems = ({
    menuItems,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            {menuItems.map(item => {
                return <h2 key={item.id}>{item.name}</h2>;
            })}
        </>
    );
};

export default menuItems