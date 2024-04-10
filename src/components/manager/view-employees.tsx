import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getAllEmployeesFromDatabase, getVerifiedEmployeesFromDatabase } from "@/lib/utils";
import { Employee } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";


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

  const numAccounts = 3;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVerifiedEmployeesFromDatabase().then((data) => {
      setEmployees(data);
    });
    setLoading(false);
  }, [loading]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Employees</CardTitle>
        <CardDescription>The following employees have logged into the system.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {
        loading ? (
          Array.from({ length: numAccounts }).map((_, index) => (
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
