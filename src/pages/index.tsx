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
import MenuItems from "@/components/customer/menu-item";

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

  
  return (
    <div className="w-full h-full flex justify-start items-start p-4">
      <h1 className="text-xl">Customer Order View</h1>
      <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <img src="/burger.jpeg" alt="burger" className="w-32 h-32" /> 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Burger Information</DialogTitle>
          <DialogDescription>
            Contains: *List of items*
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Quantity
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Add Ingredients
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
}
