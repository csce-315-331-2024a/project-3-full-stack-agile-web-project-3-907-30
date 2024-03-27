import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getEmployeeAccountsFromDatabase } from "@/lib/utils";
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
    // @ts-ignore
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getEmployeeAccountsFromDatabase().then((data) => {
            setEmployees(data);
        });
        setLoading(false);
    }, [loading]);


    return (
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Manage your employees at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
        {loading ? (
          Array.from({ length: numAccounts }).map((_, index) => (
            <div className="flex items-center space-x-4" key={index}>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        ) : (
            employees.map((employee) => (
                <div key={employee.email} className="flex justify-between gap-16 items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={employee.picture} alt="profile" />
                      <AvatarFallback>{employee.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{employee.name}</p>
                      <p className="text-xs font-light">{employee.email}</p>
                    </div>
                  </div>
                </div>
              ))
        )}
        </CardContent>
      </Card>
    );
  };
  
  export default ViewEmployees;
  