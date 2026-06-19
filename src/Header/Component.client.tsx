'use client'
import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

export const HeaderClient: React.FC = () => {
  return (
    <header className="container relative z-20">
      <div className="py-6 flex items-center justify-between">
        <Link href="/">
          <Logo loading="eager" priority="high" />
        </Link>
        <HeaderNav />
      </div>
    </header>
  )
}
