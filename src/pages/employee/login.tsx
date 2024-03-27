import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Employee, AuthHookType } from '@/lib/types';
import { getEmployeeFromDatabase } from '@/lib/utils';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

/**
 * The employee login page. This page allows employees to login.
 * 
 * @returns {JSX.Element} The employee login page.
 */
const EmployeeLogin = () => {
  const router = useRouter();
  const { login, account } = useAuth() as AuthHookType;

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

  // if the employee is logged in, redirect to /employee/order
  if (employee) {
    window.location.href = '/employee/order';
  }

  return (
    <main className="flex w-full h-dvh items-center justify-center p-4">
      <Button variant="outline" onClick={async () => await login(router)}>
        <FcGoogle className="w-6 h-6 mr-2" />
        Sign-in with Google
      </Button>
    </main>
  );
}

export default EmployeeLogin;
