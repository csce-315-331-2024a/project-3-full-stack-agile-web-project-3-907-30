<<<<<<< HEAD:src/pages/manager.tsx
import UserManagement from "@/components/manager/user-management";
import ViewEmployees from "@/components/manager/view-employees";
=======
import EmployeeManagement from "@/components/manager/employee-management";
>>>>>>> 28beefa2517e10b4f18ae02d85e29656a5264869:src/pages/employee/manager.tsx
import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType } from "@/lib/types";
import { getEmployeeFromDatabase } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * The manager view page. This page is only accessible to users that are managers or admins.
 * 
 * @component
 * @returns {JSX.Element} The manager view page.
 */
const Manager = () => {
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
      {employee?.isManager ? (
        <section className="flex w-full">
<<<<<<< HEAD:src/pages/manager.tsx
          <UserManagement />
          <ViewEmployees />
=======
          {employee?.isAdmin && (
            <EmployeeManagement />
          )}
>>>>>>> 28beefa2517e10b4f18ae02d85e29656a5264869:src/pages/employee/manager.tsx
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
