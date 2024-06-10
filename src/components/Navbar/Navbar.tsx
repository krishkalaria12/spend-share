"use client"

import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { Link } from 'next-view-transitions'
import { NavigationMenuLink, NavigationMenuList, NavigationMenu } from "@/components/ui/navigation-menu"
import ModeToggle from "@/components/theme-changer"
import Image from "next/image"
import ClerkNavbar from "./ClerkNavbar"

export const Navbar = () => {

    const NavLinks = [
        {
            link: "Home",
            href: "/"
        },
        {
            link: "Groups",
            href: "/group"
        },
        {
            link: "Friends",
            href: "/friend"
        },
        {
            link: "Expenses",
            href: "/expense"
        },
        {
            link: "Feedback",
            href: "/feedback"
        },
        {
          link: "Borrow from Friend",
          href: "/ask-friend-for-money"
        }
    ]


  return (
    <header className="flex justify-between bg-[#fff] dark:bg-[#020817] shadow-sm h-20 w-full sticky z-50 top-0 shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="/">
            <Image width={6} height={6} src={"/money-splitter.webp"} alt="Logo" className="h-6 w-6" priority={true} />
            <span className="sr-only">Company Logo</span>
          </Link>
          <div className="grid gap-2 py-6">
            {NavLinks.map((links, index) => (
                <Link key={index} className="flex w-full items-center py-2 text-lg font-semibold" href={links.href}>
                    {links.link}
                </Link>
            ))}
            <ClerkNavbar />
          </div>
        </SheetContent>
      </Sheet>
      <ModeToggle className="md:hidden" />
      <Link className="mr-6 hidden md:flex" href="/">
        <Image width={6} height={6} src={"/money-splitter.webp"} alt="Logo" className="h-6 w-6" priority={true} />
        <span className="sr-only">Company Logo</span>
      </Link>
      <NavigationMenu className="hidden justify-between items-center max-w-full md:flex">
        <NavigationMenuList>
          {
            NavLinks.map((links,index) => (
                <NavigationMenuLink key={index} asChild>
                    <Link
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                        href={links.href}
                    >
                        {links.link}
                    </Link>
                </NavigationMenuLink>
            ))
          }
        </NavigationMenuList>
        <NavigationMenuList className="space-x-4">
          <ModeToggle />
          <ClerkNavbar />
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}