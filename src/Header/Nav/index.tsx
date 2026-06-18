'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { headerNavItems } from '@/constants'
import { cn } from '@/utilities/ui'
import { Menu, SearchIcon } from 'lucide-react'
import Link from 'next/link'

export const HeaderNav: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {headerNavItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={item.href}>{item.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <Button
        asChild
        aria-label="Search"
        className="hidden md:inline-flex"
        size="icon"
        variant="ghost"
      >
        <Link href="/search">
          <SearchIcon className="size-5" />
        </Link>
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button aria-label="Open navigation" className="md:hidden" size="icon" variant="ghost">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[20rem] max-w-[85vw]" side="right">
          <SheetHeader>
            <SheetTitle>PinNepal</SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-2">
            {headerNavItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  className={cn(
                    'rounded-md px-3 py-3 text-base font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
