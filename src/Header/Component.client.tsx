'use client'

import { headerNavItems, mobileNavItems } from '@/constants'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const isActivePath = (pathname: string, href: string) => {
  if (href === '/') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const HeaderClient: React.FC = () => {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Detect scroll to trigger the background transition
  useEffect(() => {
    const updateScrolled = () => {
      const nextIsScrolled = window.scrollY > 18
      setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled))
    }

    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })

    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMenuOpen])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-0.5 md:px-6 md:pt-2">
      <motion.div
        animate={{
          // BACKGROUND:
          // Initial: A slight dark/neutral tint (rgba 0,0,0,0.15) ensures white text is readable
          // over bright hero images while letting the blur do the heavy lifting.
          // Scrolled: Solid green brand color.
          backgroundColor: isScrolled ? 'rgba(61, 122, 90, 0.94)' : 'rgba(0, 0, 0, 0.5)',

          // BORDER:
          // Initial: A slightly brighter white border defines the edge of the glass pill.
          // Scrolled: Dimmer border since the solid green establishes the shape.
          borderColor: isScrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)',

          // SHADOW:
          // Initial: Soft drop shadow to lift the glass off the page.
          // Scrolled: Deeper shadow for the solid header.
          boxShadow: isScrolled
            ? '0 18px 54px rgba(28, 46, 94, 0.18)'
            : '0 8px 32px rgba(0, 0, 0, 0.12)',
        }}
        className={cn(
          'pointer-events-auto mx-auto flex h-[58px] w-full max-w-[96rem] items-center justify-between',
          // LIQUID GLASS CORE CLASSES:
          // backdrop-blur-xl creates the heavy frost.
          // backdrop-saturate-150 makes the colors behind the nav pop, matching the Apple aesthetic.
          'rounded-full border px-3 pl-3.5 backdrop-blur-xl backdrop-saturate-150 md:h-[62px] md:px-3 md:pl-4',
        )}
        initial={false}
        // Use a slightly springy or smooth easing for a premium feel
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          aria-label="PinNepal home"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          href="/"
        >
          <Logo compact loading="eager" priority="high" variant="light" />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {headerNavItems.map((item) => {
            const isActive = isActivePath(pathname, item.href)

            return (
              <Link
                className={cn(
                  'rounded-full px-4 py-2 text-[0.82rem] font-semibold uppercase leading-none tracking-[0.04em]',
                  'text-white transition-colors duration-200 hover:bg-white/20 hover:text-white',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                  isActive && 'bg-accent/[0.2] text-white',
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            aria-label="Search PinNepal"
            className={cn(
              'hidden size-10 items-center justify-center rounded-full text-white transition-colors',
              'hover:bg-white/[0.2] hover:text-white focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-white/70 md:inline-flex',
            )}
            href="/search"
          >
            <Search aria-hidden="true" className="size-[1.125rem]" />
          </Link>

          <Link
            className={cn(
              'hidden rounded-full bg-white px-5 py-2.5 text-[0.76rem] font-semibold uppercase',
              'leading-none tracking-[0.06em] text-[var(--pn-sage-dark)] shadow-sm transition-colors',
              'hover:bg-[var(--pn-snow)] focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-white/70 md:inline-flex',
            )}
            href="/tour-packages"
          >
            Browse Nepal packages
          </Link>

          <button
            aria-expanded={isMenuOpen}
            aria-label="Open navigation"
            className={cn(
              'inline-flex size-11 items-center justify-center rounded-full text-white transition-colors',
              'hover:bg-white/[0.2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:hidden',
            )}
            onClick={() => setIsMenuOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </motion.div>

      {/* MOBILE MENU REMAINS UNCHANGED */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div className="pointer-events-auto fixed inset-0 z-[60] lg:hidden">
            <motion.button
              aria-label="Close navigation backdrop"
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-[rgba(28,46,94,0.36)] backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              transition={{ duration: 0.18 }}
              type="button"
            />

            <motion.aside
              animate={{ opacity: 1, x: 0 }}
              aria-label="Mobile navigation"
              aria-modal="true"
              className={cn(
                'absolute right-0 top-0 flex h-dvh w-[min(88vw,26rem)] flex-col overflow-y-auto',
                'border-l border-[rgba(28,46,94,0.12)] bg-[var(--pn-snow)] px-5 py-5 shadow-2xl',
              )}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 1, x: '100%' }}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 1, x: '100%' }}
              role="dialog"
              transition={{ duration: shouldReduceMotion ? 0.12 : 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between gap-4">
                <Link
                  aria-label="PinNepal home"
                  className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)]"
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Logo />
                </Link>
                <button
                  aria-label="Close navigation"
                  className={cn(
                    'inline-flex size-11 items-center justify-center rounded-full border border-[var(--pn-border)]',
                    'text-[var(--pn-navy)] transition-colors hover:border-[var(--pn-sage)] hover:text-[var(--pn-sage)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)]',
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  type="button"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>

              <div className="mt-12">
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--pn-mist)]">
                  Routes from Nepal
                </p>
                <nav aria-label="Mobile primary navigation" className="mt-5 grid gap-2">
                  {mobileNavItems.map((item) => {
                    const isActive = isActivePath(pathname, item.href)

                    return (
                      <Link
                        className={cn(
                          'group grid gap-1 rounded-[var(--radius-card)] border border-transparent px-3 py-3',
                          'transition-colors hover:border-[var(--pn-border)] hover:bg-white',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)]',
                          isActive && 'border-[var(--pn-border)] bg-white',
                        )}
                        href={item.href}
                        key={item.href}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="flex items-center justify-between gap-4">
                          <span className="font-serif text-2xl font-bold leading-tight text-[var(--pn-navy)]">
                            {item.label}
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            className="size-4 text-[var(--pn-orange)] transition-transform group-hover:translate-x-0.5"
                          />
                        </span>
                        {item.description && (
                          <span className="text-sm leading-5 text-[var(--pn-body)]">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="mt-auto border-t border-[var(--pn-border)] pt-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--pn-mist)]">
                  Kathmandu local team
                </p>
                <Link
                  className={cn(
                    'mt-4 inline-flex w-full items-center justify-center rounded-[var(--radius-btn)]',
                    'bg-[var(--pn-sage)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.06em]',
                    'text-white transition-colors hover:bg-[var(--pn-sage-dark)] focus-visible:outline-none',
                    'focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)]',
                  )}
                  href="/tour-packages"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View the itineraries
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
