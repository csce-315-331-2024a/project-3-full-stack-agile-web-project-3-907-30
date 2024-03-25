import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Account, AuthHookType } from '@/lib/types';
import { getAccountFromDatabase } from '@/lib/utils';

/**
 * The menu page. This page is only accessible to users that are employees or managers.
 * 
 * @returns {JSX.Element} The menu page.
 */
const Menu = () => {
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
      {fullAccount?.isEmployee ? (
        <h1 className="text-xl">Menu View</h1>
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

export default Menu;
