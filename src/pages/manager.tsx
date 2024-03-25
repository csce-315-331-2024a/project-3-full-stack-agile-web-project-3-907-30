import UserManagement from "@/components/manager/user-management";
import useAuth from "@/hooks/useAuth";
import { Account, AuthHookType } from "@/lib/types";
import { getAccountFromDatabase } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * The manager view page. This page is only accessible to users that are managers.
 * 
 * @component
 * @returns {JSX.Element} The manager view page.
 */
const Manager = () => {
  const { account } = useAuth() as AuthHookType;
  
  const [fullAccount, setFullAccount] = useState<Account>();
  const [loading, setLoading] = useState(false);

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
      {fullAccount?.isManager ? (
        <section className="flex w-full">
          {fullAccount?.isAdmin && (
            <UserManagement />
          )}
        </section>
      ) : (loading ? (
        <h1 className="text-xl">Loading...</h1>
      ) : (
        <h1 className="text-xl">
          You are unauthorized to view this page.
        </h1>
      )
      )}
    </main>
  );
}

export default Manager;
