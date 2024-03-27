import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Account, AuthHookType } from "@/lib/types";
import { getAccountFromDatabase } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menu } from "lucide-react";
// import customerView from "@/components/customer/customer-view";
import CustomerView from "@/components/customer/customer-view";

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
    console.log(account);
    if (account) {
      getAccountFromDatabase(account.email).then((data) => {
        setFullAccount(data);
      });
    }
  }, [account]);

  
  // Return something else for now
  return (
    <div>
      <h1>Home</h1>
      < CustomerView />
    </div>
  );
   
}
