import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Employee, AuthHookType } from '@/lib/types';
import { getEmployeeFromDatabase } from '@/lib/utils';

/**
 * The menu page. This page is only accessible to users that are employees or managers.
 * 
 * @returns {JSX.Element} The menu page.
 */
const Menu = () => {
  const { account } = useAuth() as AuthHookType;

  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setLoading(true);
      getEmployeeFromDatabase(account.email).then((data) => {
        setEmployee(data);
        setLoading(false);
      });
    }
  }, [account]);

  return (
    <main className="flex w-full h-full items-start justify-start p-4">
      {employee && employee.isVerified ? (
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
