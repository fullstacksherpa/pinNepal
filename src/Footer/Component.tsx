import { footerNavGroups } from '@/constants'
import { ArrowRight, Compass, MapPinned, Route } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'

export function Footer() {
  return (
    <footer className="mt-auto overflow-hidden bg-[var(--pn-navy)] text-white">
      <div className="border-b border-white/10 bg-[var(--pn-sage)]">
        <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/[0.55]">
              We are Nepal
            </p>
            <p className="mt-1 max-w-2xl font-serif text-2xl font-bold leading-tight text-white md:text-3xl">
              Routes planned by a local team from Kathmandu to the high passes.
            </p>
          </div>
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-btn)] bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.06em] text-[var(--pn-sage-dark)] transition-colors hover:bg-[var(--pn-snow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            href="/tour-packages"
          >
            View the itineraries
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="max-w-md">
            <Link
              aria-label="PinNepal home"
              className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              href="/"
            >
              <Logo variant="light" />
            </Link>
            <p className="mt-6 text-base leading-7 text-white/[0.72]">
              Born in the Himalayas and run by the Sherpas who know them best, PinNepal is your
              ultimate all-access pass to adventure. From epic trekking packages and raw road
              journeys to a deep vault of insider travel notes, we’ve got your back. Let us be your
              compass to the real Nepal - with us leading the way, you won&apos;t miss a single
              hidden gem.
            </p>

            <div className="mt-7 grid gap-3 text-sm text-white/70 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-center gap-3 border-l border-[var(--pn-orange)] pl-3">
                <MapPinned aria-hidden="true" className="size-4 text-[var(--pn-orange)]" />
                <span>Kathmandu based</span>
              </div>
              <div className="flex items-center gap-3 border-l border-[var(--pn-orange)] pl-3">
                <Route aria-hidden="true" className="size-4 text-[var(--pn-orange)]" />
                <span>Treks and motorbike routes</span>
              </div>
              <div className="flex items-center gap-3 border-l border-[var(--pn-orange)] pl-3">
                <Compass aria-hidden="true" className="size-4 text-[var(--pn-orange)]" />
                <span>Permit-aware planning</span>
              </div>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid gap-8 sm:grid-cols-3 lg:justify-self-end lg:gap-12"
          >
            {footerNavGroups.map((group) => (
              <div key={group.label}>
                <h2 className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-white/[0.42]">
                  {group.label}
                </h2>
                <ul className="mt-4 grid gap-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="text-sm font-semibold text-white/[0.78] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-[0.67rem] uppercase tracking-[0.18em] text-white/[0.45] md:flex-row md:items-center md:justify-between">
          <p>PinNepal &copy; {new Date().getFullYear()}</p>
          <p>Travel & Adventure / Nepal</p>
        </div>
      </div>
    </footer>
  )
}
