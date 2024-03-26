import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getAllAccountsFromDatabase, getRole } from "@/lib/utils";
import { Account } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";

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
const MenuItems = () => {
  const roles = ['Customer', 'Employee', 'Manager', 'Admin'];

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
   * Updates the role of an account.
   * 
   * @param {string} email The email of the account to update.
   * @param {string} role The new role of the account.
   */
  const updateRole = async (email: string, role: string) => {
    setIsSubmitting(true);

    let isAdmin = role === 'Admin';
    let isManager = role === 'Manager' || role === 'Admin';
    let isEmployee = role === 'Employee' || role === 'Manager' || role === 'Admin';

    const res = await fetch('/api/account/set', {
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
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your users at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {
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
              <Select disabled={isSubmitting} onValueChange={(value) => updateRole(account.email, value)} defaultValue={getRole(account)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={getRole(account)} />
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

export default MenuItems;
