import { footerNavItems } from '@/constants'
import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-black text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <nav className="flex flex-col md:flex-row gap-4">
            {footerNavItems.map((item) => (
              <Link className="text-white hover:underline" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
