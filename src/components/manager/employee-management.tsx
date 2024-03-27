import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getAllEmployeesFromDatabase, getRole } from "@/lib/utils";
import { Employee } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";

/**
 * An employee management component that allows admins to manage their employees and managers. 
 * 
 * @component
 * @returns {JSX.Element} The employee management component.
 * 
 * @example
 * // Render a employee management component.
 * <EmployeeManagement />
 */
const EmployeeManagement = () => {
  const roles = ['Employee', 'Manager', 'Admin'];

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getAllEmployeesFromDatabase().then((data) => {
      setEmployees(data);
    });
    setLoading(false);
  }, [loading]);

  /**
   * Updates the role of an employee.
   * 
   * @param {string} email The email of the employee to update.
   * @param {string} role The new role of the employee.
   */
  const updateRole = async (email: string, role: string) => {
    setIsSubmitting(true);

    let isAdmin = role === 'Admin';
    let isManager = role === 'Manager' || role === 'Admin';
    let isEmployee = role === 'Employee' || role === 'Manager' || role === 'Admin';

    const res = await fetch('/api/employee/set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, isEmployee, isManager, isAdmin }),
    });

    if (res.status === 200) {
      toast({
        title: 'Success!',
        description: 'Role updated successfully.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>Manage your employees at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {
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
              <Select disabled={isSubmitting} onValueChange={(value) => updateRole(employee.empEmail, value)} defaultValue={getRole(employee)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={getRole(employee)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role} className="cursor-pointer">{role}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))
        }
      </CardContent>
    </Card>
  );
};

export default EmployeeManagement;
