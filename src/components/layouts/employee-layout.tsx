// import useAuth from "@/hooks/useAuth";
// import { Employee, AuthHookType } from "@/lib/types";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Badge } from "../ui/badge";
// import { useState, useEffect, ReactNode } from "react";
// import { getEmployeeFromDatabase, getRole } from "@/lib/utils";
// import { TbLogout2 } from "react-icons/tb";
// import { useRouter } from "next/router";
// import revLogo from "../../public/rev-logo.png";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { FcGoogle } from "react-icons/fc";
// import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
// import Link from "next/link"
// import { Toaster } from "@/components/ui/toaster";
// import { Skeleton } from "@/components/ui/skeleton";

// interface LayoutProps {
//   children: ReactNode;
// }

// /**
//  * The layout component that wraps the entire application.
//  * 
//  * @component
//  * @param {ReactNode} children The children of the layout.
//  * @returns {JSX.Element} The layout component.
//  */
// const Layout = ({ children }: LayoutProps) => {
//   const router = useRouter();
//   const { login, logout, employee } = useAuth() as AuthHookType;

//   const [fullEmployee, setFullEmployee] = useState<Employee>();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (employee) {
//       setLoading(true);
//       getEmployeeFromDatabase(employee.empEmail).then((data) => {
//         setFullEmployee(data);
//         setLoading(false);
//       });
//     }
//   }, [employee]);

//   return (
//     <main className="flex flex-col w-full h-dvh">
//       <div className="border-b">
//         <div className="flex h-16 items-center justify-between px-4">
//           <div className="flex gap-4">
//             <Image src={revLogo} alt="Rev's American Grill Logo" className="w-20 rounded-sm" priority />
//             <NavigationMenu>
//               <NavigationMenuList>
//                 <NavigationMenuItem>
//                   <Link href="/" legacyBehavior passHref>
//                     <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/'}>
//                       Customer Order View
//                     </NavigationMenuLink>
//                   </Link>
//                 </NavigationMenuItem>
//                 {fullEmployee && (
//                   <>
//                     <NavigationMenuItem>
//                       <Link href="/employee" legacyBehavior passHref>
//                         <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/employee'}>
//                           Employee Order View
//                         </NavigationMenuLink>
//                       </Link>
//                     </NavigationMenuItem>
//                     <NavigationMenuItem>
//                       <Link href="/menu" legacyBehavior passHref>
//                         <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/menu'}>
//                           Menu View
//                         </NavigationMenuLink>
//                       </Link>
//                     </NavigationMenuItem>
//                   </>
//                 )}
//                 {fullEmployee && fullEmployee.isManager && (
//                   <NavigationMenuItem>
//                     <Link href="/manager" legacyBehavior passHref>
//                       <NavigationMenuLink className={navigationMenuTriggerStyle()} active={router.asPath === '/manager'}>
//                         Manager View
//                       </NavigationMenuLink>
//                     </Link>
//                   </NavigationMenuItem>
//                 )}
//               </NavigationMenuList>
//             </NavigationMenu>
//           </div>
//           {fullEmployee ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild className="cursor-pointer">
//                 <Avatar>
//                   <AvatarImage src={fullEmployee?.empPicture} alt="profile" />
//                   <AvatarFallback>{fullEmployee?.empName[0]}</AvatarFallback>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-fit mr-4 mt-1">
//                 <DropdownMenuLabel className="text-xl">{fullEmployee?.empName}</DropdownMenuLabel>
//                 <DropdownMenuLabel className="font-light -mt-3">{fullEmployee?.empEmail}</DropdownMenuLabel>
//                 <Badge className="ml-2 mb-2 text-xs mt-1">{getRole(fullEmployee)}</Badge>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={async () => await logout()}>
//                   <TbLogout2 className="mr-2 h-4 w-4" />
//                   <span>Logout</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (loading ? (
//             <Skeleton className="w-10 h-10 rounded-full" />
//           ) : (
//             <Button variant="outline" onClick={async () => await login(router)}>
//               <FcGoogle className="w-6 h-6 mr-2" />
//               Sign-in with Google
//             </Button>
//           )
//           )}
//         </div>
//       </div>
//       {children}
//       <Toaster />
//     </main >
//   )
// };

// export default Layout;
