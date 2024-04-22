import useAuth from "@/hooks/useAuth";
import { Employee, AuthHookType, Customer } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, ReactNode } from "react";
import { getEmployeeFromDatabase, getRole } from "@/lib/utils";
import { TbLogout2 } from "react-icons/tb";
import { useRouter } from "next/router";
import revLogo from "../../public/rev-logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import RewardsButton from "@/components/customer/rewards-button";
import CustomerInfo from "@/components/customer/customer-info";
import { Weather } from "./api/customer/weather";
import { getCurrentWeather } from "@/components/customer/customer-weather";
import Head from "next/head";
import Translate from "@/components/common/translate";
import { Menu } from "lucide-react";

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

  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer>();
  const [weather, setWeather] = useState<Weather>({ value: 0, isDay: true, description: 'Clear' });
  const [translatedCategories, setTranslatedCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [originalMenuItems, setOriginalMenuItems] = useState<any[]>([]);






  useEffect(() => {
    if (account) {
      setLoading(true);
      getEmployeeFromDatabase(account.email).then((data) => {
        setEmployee(data);
        setLoading(false);
      });
    }
    if (router.asPath === '/') {
      getCurrentWeather().then((data) => {
        setWeather(data);
      })
    }
  }, [account, router.asPath]);



  return (
    <>
      <Head>
        <title>Rev&apos;s American Grill</title>
      </Head>
      {router.asPath === '/' ? (
        <main className="flex flex-col w-full md:h-dvh" >
          <div className="border-b">
            <div className="flex items-center justify-between p-2 lg:p-4 flex-wrap">
              <div className="flex gap-2">
                <Image src={revLogo} alt="Rev's American Grill Logo" className="w-16 lg:w-20 rounded-sm" priority />
                <Translate />
                <span className="hidden lg:flex">
                  <CustomerInfo weather={weather} />
                </span>
                <span className="block lg:hidden">
                  <RewardsButton setCustomer={setCustomer} />
                </span>
              </div>
              <div className="lg:flex gap-4 hidden">
                <RewardsButton setCustomer={setCustomer} />
                <Button name="rateUs">
                  <Link target="_blank" href="https://www.yelp.com/writeareview/biz/6dSStUCjMAfixAqz73iy9g?return_url=%2Fbiz%2F6dSStUCjMAfixAqz73iy9g&review_origin=biz-details-war-button">
                    Rate Us! 🌟
                  </Link>
                </Button>
                <Button variant="outline" asChild name="employeeLogin">
                  <Link href="/employee/login">
                    I&apos;m an Employee
                  </Link>
                </Button>
              </div>
              {/* dropdown for mobile */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Button name="menu">
                      <Menu className="w-6 h-6" />
                      <span className="hidden">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit mr-4 mt-1 notranslate">
                    <DropdownMenuItem>
                      <CustomerInfo weather={weather} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link target="_blank" href="https://www.yelp.com/writeareview/biz/6dSStUCjMAfixAqz73iy9g?return_url=%2Fbiz%2F6dSStUCjMAfixAqz73iy9g&review_origin=biz-details-war-button">
                        Rate Us! 🌟
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/employee/login">
                        I&apos;m an Employee
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          {children}
          <Toaster />
        </main >
      ) : router.asPath === '/employee/login' || router.asPath.startsWith('/employee/menu') ? (
        <>
          {children}
          <Toaster />
        </>
      ) : (
        <main className="flex flex-col w-full h-dvh">
          <div className="border-b">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex gap-4">
                <Image src={revLogo} alt="Rev's American Grill Logo" className="w-20 rounded-sm" priority />
                <Translate />
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/'}>
                          Customer Order View
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    {employee && (
                      <>
                        <NavigationMenuItem>
                          <Link href="/employee/order" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/employee/order'}>
                              Employee Order View
                            </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>Menu Views</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 place-items-center">
                              <Link href="/employee/menu1" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/employee/menu'}>
                                  Menu View 1
                                </NavigationMenuLink>
                              </Link>
                              <Link href="/employee/menu2" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/employee/menu'}>
                                  Menu View 2
                                </NavigationMenuLink>
                              </Link>
                              <Link href="/employee/menu3" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/employee/menu'}>
                                  Menu View 3
                                </NavigationMenuLink>
                              </Link>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Link href="/employee/kitchen" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/employee/kitchen'}>
                              Kitchen View
                            </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>
                      </>
                    )}
                    {employee && employee.isManager && (
                      <NavigationMenuItem>
                        <Link href="/employee/manager" legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/employee/manager'}>
                            Manager View
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
              {employee ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Avatar>
                      <AvatarImage src={employee?.empPicture} alt="profile" />
                      <AvatarFallback>{employee?.empName[0]}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit mr-4 mt-1 notranslate">
                    <DropdownMenuLabel className="text-xl">{employee?.empName}</DropdownMenuLabel>
                    <DropdownMenuLabel className="font-light -mt-3">{employee?.empEmail}</DropdownMenuLabel>
                    <Badge className="ml-2 mb-2 text-xs mt-1">{getRole(employee)}</Badge>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={async () => await logout()}>
                      <TbLogout2 className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (loading ? (
                <Skeleton className="w-10 h-10 rounded-full" />
              ) : (
                <Button variant="outline" onClick={async () => await login(router)} name="googleLogin">
                  <FcGoogle className="w-6 h-6 mr-2" />
                  Sign-in with Google
                </Button>
              )
              )}
            </div>
          </div>
          {children}
          <Toaster />
        </main >
      )}
    </>
  )
};

export default Layout;