import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { Employee, AuthHookType } from '@/lib/types';
import { getEmployeeFromDatabase } from '@/lib/utils';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import revLogo from "../../../public/rev-logo.png";
import Image from 'next/image';

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
    <main className="flex flex-col w-full h-dvh items-center justify-center p-4 gap-8">
      <div className="flex flex-col gap-2 text-center">
        <Image src={revLogo} alt="Rev's Logo" className="w-48 rounded-md" />
        <h1 className="font-semibold text-xl">Employee Portal</h1>
      </div>
      <Button variant="outline" onClick={async () => await login(router)}>
        <FcGoogle className="w-6 h-6 mr-2" />
        Sign-in with Google
      </Button>
    </main>
  );
}

export default EmployeeLogin;
