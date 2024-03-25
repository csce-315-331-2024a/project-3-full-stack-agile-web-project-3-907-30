import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Account, AuthHookType } from "@/lib/types";
import { getAccountFromDatabase } from "@/lib/utils";

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

  const [fullAccount, setFullAccount] = useState<Account>();

  useEffect(() => {
    if (account) {
      getAccountFromDatabase(account.email).then((data) => {
        setFullAccount(data);
      });
    }
  }, [account]);

  return (
    <div className="w-full h-full flex justify-start items-start p-4">
      <h1 className="text-xl">Customer Order View</h1>
    </div>
  );
}
