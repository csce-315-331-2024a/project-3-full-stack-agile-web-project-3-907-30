import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { getVerifiedEmployeesFromDatabase } from "@/lib/utils";
import { Employee } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Skeleton } from "../../ui/skeleton";


/**
 * A component that allows managers to view employees that are logged into the POS system
 * 
 * @component
 * @returns {JSX.Element} The ViewEmployees component.
 * 
 * @example
 * // Render a ViewEmployees component.
 * <ViewEmployees />
 */
const ViewEmployees = () => {

<<<<<<< HEAD:src/components/manager/view-employees.tsx
  const numAccounts = 3;
=======
  const skeletonCount = 3;
>>>>>>> ba4116966c749bc32159ea8a7cf2b1ea0e18a7cd:src/components/manager/management/view-employees.tsx
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVerifiedEmployeesFromDatabase().then((data) => {
      setEmployees(data);
    });
    setLoading(false);
  }, [loading]);


  return (
    <Card className="w-1/2 overflow-y-scroll">
      <CardHeader>
        <CardTitle>Current Employees</CardTitle>
        <CardDescription>The following employees have logged into the system.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
<<<<<<< HEAD:src/components/manager/view-employees.tsx
        {
        loading ? (
          Array.from({ length: numAccounts }).map((_, index) => (
=======
        {loading ? (
          Array.from({ length: skeletonCount }).map((_, index) => (
>>>>>>> ba4116966c749bc32159ea8a7cf2b1ea0e18a7cd:src/components/manager/management/view-employees.tsx
            <div className="flex items-center space-x-4" key={index}>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        ) : (employees.length > 0 ?
          employees.map((employee) => (
            <div key={employee.empEmail} className="flex justify-between gap-16 items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={employee.empPicture} alt="profile" />
                  <AvatarFallback>{employee.empName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{employee.empName}</p>
                  <p className="text-xs font-light">{employee.empEmail}</p>
                </div>
              </div>
            </div>
          )) : (
            <p>No employees found.</p>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default ViewEmployees;
