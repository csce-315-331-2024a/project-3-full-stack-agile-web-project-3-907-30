import useAuth from "@/hooks/useAuth";
import { Account, AuthHookType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import { useState, useEffect, ReactNode } from "react";
import { getAccountFromDatabase } from "@/lib/utils";
import { TbLogout2 } from "react-icons/tb";
import { useRouter } from "next/router";
import revLogo from "../../public/rev-logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: ReactNode;
}

/**
 * The layout component that wraps the entire application.
 * 
 * @component
 * @param {ReactNode} children The children of the layout.
 * @returns {JSX.Element} The layout component.
 */
const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { login, logout, account } = useAuth() as AuthHookType;
  const [fullAccount, setFullAccount] = useState<Account>();

  useEffect(() => {
    if (account) {
      getAccountFromDatabase(account.email).then((data) => {
        setFullAccount(data);
      });
    }
  }, [account]);

  const getRole = (account: Account) => {
    if (account.isAdmin) {
      return 'Admin';
    } else if (account.isManager) {
      return 'Manager';
    } else if (account.isEmployee) {
      return 'Employee';
    } else {
      return 'Customer';
    }
  }

  return (
    <main className="flex flex-col w-full h-dvh">
      <div className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex gap-4">
            <Image src={revLogo} alt="Rev's American Grill Logo" className="w-20 rounded-sm" priority />
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/'}>
                      Customer Order View
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {fullAccount && fullAccount.isEmployee && (
                  <>
                    <NavigationMenuItem>
                      <Link href="/employee" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/employee'}>
                          Employee Order View
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/menu" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/menu'}>
                          Menu View
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </>
                )}
                {fullAccount && fullAccount.isManager && (
                  <NavigationMenuItem>
                    <Link href="/manager" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/manager'}>
                        Manager View
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {fullAccount ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar>
                  <AvatarImage src={fullAccount?.picture} alt="profile" />
                  <AvatarFallback>{fullAccount?.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit mr-4 mt-1">
                <DropdownMenuLabel className="text-xl">{fullAccount?.name}</DropdownMenuLabel>
                <DropdownMenuLabel className="font-light -mt-3">{fullAccount?.email}</DropdownMenuLabel>
                <Badge className="ml-2 mb-2 text-xs mt-1">{getRole(fullAccount)}</Badge>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => await logout()}>
                  <TbLogout2 className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={async () => await login(router)}>
              <FcGoogle className="w-6 h-6 mr-2" />
              Sign-in with Google
            </Button>
          )}
        </div>
      </div>
      {children}
      <Toaster />
    </main >
  )
};

export default Layout;
