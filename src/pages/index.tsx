import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Employee, AuthHookType } from "@/lib/types";
import { getEmployeeFromDatabase } from "@/lib/utils";
import CustomerView from "@/components/customer/customer-view";
import Head from "next/head";
/**
 * Fetch data and render the contents of a page at request time.
 * 
 * @param {any} context The context of the page.
 * @returns {any} The props of the page.
 */
export async function getServerSideProps(context: any) {
  if (context.req.session.account === undefined) {
    return {
      props: {
        account: null,
      },
    };
  }

  return {
    props: { account: context.req.session.account },
  };
}

/**
 * The home page. This page is accessible to users that are customers, employees, or managers.
 * 
 * @component
 * @returns {JSX.Element} The home page.
 */
export default function Home() {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();

  useEffect(() => {
    if (account) {
      getEmployeeFromDatabase(account.email).then((data) => {
        setEmployee(data);
      });
    }
  }, [account]);

  
  return (
    <>
      <Head>
        <title>Rev&pos;s American Grill</title>
      </Head>
      <div>
        <h1>Rev&pos;s American Grill</h1>
        <h2>Ordering Menu</h2>
        <CustomerView />
      </div>
    </>
  );
}
