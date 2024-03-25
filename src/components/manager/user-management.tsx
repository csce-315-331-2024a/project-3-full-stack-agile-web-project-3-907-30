import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getAllAccountsFromDatabase } from "@/lib/utils";
import { Account } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";

/**
 * A user management component that allows managers to view and update user roles.
 * 
 * @component
 * @returns {JSX.Element} The user management component.
 * 
 * @example
 * // Render a user management component.
 * <UserManagement />
 */
const UserManagement = () => {
  const roles = ['Customer', 'Employee', 'Manager'];
  const numAccounts = 3;

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getAllAccountsFromDatabase().then((data) => {
      setAccounts(data);
    });
    setLoading(false);
  }, [loading]);

  /**
   * Gets the current role of an account. Can be 'Manager', 'Employee', or 'Customer'.
   * 
   * @param {Account} account The account to get the role of.
   * @returns {string} The current role of the account.
   */
  const getCurrentRole = (account: Account) => {
    if (account.isManager) {
      return 'Manager';
    } else if (account.isEmployee) {
      return 'Employee';
    } else {
      return 'Customer';
    }
  }

  /**
   * Updates the role of an account.
   * 
   * @param {string} email The email of the account to update.
   * @param {string} role The new role of the account.
   */
  const updateRole = async (email: string, role: string) => {
    setIsSubmitting(true);

    let isManager = role === 'Manager';
    let isEmployee = role === 'Employee' || role === 'Manager';

    const res = await fetch('/api/account/set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, isEmployee, isManager }),
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
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your users at a glance.</CardDescription>
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
          accounts.map((account) => (
            <div key={account.email} className="flex justify-between gap-16 items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={account.picture} alt="profile" />
                  <AvatarFallback>{account.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{account.name}</p>
                  <p className="text-xs font-light">{account.email}</p>
                </div>
              </div>
              <Select disabled={isSubmitting} onValueChange={(value) => updateRole(account.email, value)} defaultValue={getCurrentRole(account)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={getCurrentRole(account)} />
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
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
