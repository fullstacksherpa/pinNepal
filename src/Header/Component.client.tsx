'use client'

import { headerNavItems, mobileNavItems } from '@/constants'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isActivePath = (pathname: string, href: string) => {
  if (href === '/') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

// ---------------------------------------------------------------------------
// Variants
//
// Using named variants instead of an inline `animate` object solves the
// colour-glitch-on-scroll-up bug. When the animate prop is a plain object,
// Framer Motion re-interpolates from the *initial* value every time the
// component re-renders (e.g. on scroll). Named variants only transition
// between the two states you define, so there is no unwanted colour flash.
// ---------------------------------------------------------------------------

const pillVariants = {
  /**
   * AT_TOP  — near the very top of the page.
   * A lightly frosted pill. We keep opacity high enough here so that text
   * is still readable even over a white or very light hero background.
   */
  atTop: {
    backgroundColor: 'rgba(245, 247, 244, 0.72)',
    borderColor: 'rgba(255, 255, 255, 0.50)',
    boxShadow: '0 4px 24px rgba(28, 46, 94, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.70)',
  },
  /**
   * SCROLLED — after the user has scrolled past the top threshold.
   * A denser glass so the navy text stays readable over any page content
   * scrolling behind the pill.
   */
  scrolled: {
    backgroundColor: 'rgba(240, 244, 241, 0.82)',
    borderColor: 'rgba(255, 255, 255, 0.42)',
    boxShadow: '0 8px 40px rgba(28, 46, 94, 0.13), inset 0 1px 0 rgba(255, 255, 255, 0.65)',
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const HeaderClient: React.FC = () => {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)

  // Tracks the last scroll position. A ref avoids triggering a re-render on
  // every pixel of movement — only state that affects the UI uses useState.
  const lastScrollYRef = useRef(0)

  // Used to batch scroll events through requestAnimationFrame so we do the
  // minimum amount of work and keep animation smooth.
  const frameRef = useRef<number | null>(null)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  // Reset visibility and close the mobile menu on every route change.
  useEffect(() => {
    setIsMenuOpen(false)
    setIsHeaderHidden(false)
  }, [pathname])

  // ---------------------------------------------------------------------------
  // Scroll handler
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // How far to scroll before the pill gains extra opacity.
    const SOLID_AFTER_Y = 20
    // How far to scroll before we start hiding the header on scroll-down.
    const HIDE_AFTER_Y = 96
    // Ignore micro-movements so the header does not flicker.
    const MIN_SCROLL_DELTA = 6

    const updateHeaderFromScroll = () => {
      const currentY = window.scrollY
      const lastY = lastScrollYRef.current
      const delta = currentY - lastY

      // Switch the pill variant once the user leaves the very top.
      setIsScrolled(currentY > SOLID_AFTER_Y)

      // Never hide the header while the mobile menu is open — it would
      // clip the close button and feel broken.
      if (isMenuOpen) {
        setIsHeaderHidden(false)
        lastScrollYRef.current = currentY
        frameRef.current = null
        return
      }

      // Always visible near the top of the page.
      if (currentY <= HIDE_AFTER_Y) {
        setIsHeaderHidden(false)
        lastScrollYRef.current = currentY
        frameRef.current = null
        return
      }

      // Ignore jitter below the minimum threshold.
      if (Math.abs(delta) < MIN_SCROLL_DELTA) {
        frameRef.current = null
        return
      }

      // Scroll down  → hide header.
      // Scroll up    → reveal header immediately.
      setIsHeaderHidden(delta > 0)

      lastScrollYRef.current = currentY
      frameRef.current = null
    }

    const onScroll = () => {
      // Skip if a frame is already queued — avoids redundant work.
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(updateHeaderFromScroll)
    }

    // Sync state with the current scroll position on mount.
    updateHeaderFromScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [isMenuOpen])

  // ---------------------------------------------------------------------------
  // Body scroll lock when the mobile menu is open
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Desktop + tablet header                                              */}
      {/* ------------------------------------------------------------------ */}
      <motion.header
        animate={{
          y: isHeaderHidden ? -96 : 0,
          opacity: isHeaderHidden ? 0 : 1,
          scale: isHeaderHidden ? 0.985 : 1,
        }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5"
        initial={false}
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : { type: 'spring', stiffness: 420, damping: 38, mass: 0.82 }
        }
      >
        {/*
         * The pill itself. Using `variants` + `animate` as a string key means
         * Framer Motion only ever interpolates between `atTop` and `scrolled`,
         * never from the initial value. This eliminates the colour glitch that
         * happened when scrolling back up caused the animation to restart from
         * the wrong colour baseline.
         */}
        <motion.div
          animate={isScrolled ? 'scrolled' : 'atTop'}
          className={cn(
            'pointer-events-auto relative mx-auto flex h-[58px] w-full max-w-[96rem] items-center justify-between overflow-hidden',
            'rounded-full border px-3 pl-3.5 md:h-[62px] md:px-3 md:pl-4',
            // Frosted glass layers — blur + saturation boost
            'backdrop-blur-2xl backdrop-saturate-150',
          )}
          initial={false}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          variants={pillVariants}
        >
          {/*
           * Reflective highlight layer — simulates the top-lit glass edge.
           * Slightly more opaque than before so it does not wash out text.
           */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.15)_42%,rgba(255,255,255,0.03))]"
          />

          {/* Thin inner border that reinforces the glass edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[1px] rounded-full border border-white/25"
          />

          {/* Logo */}
          <Link
            aria-label="PinNepal home"
            className="relative z-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)]"
            href="/"
          >
            <Logo compact loading="eager" priority="high" />
          </Link>

          {/* Desktop navigation links */}
          <nav
            aria-label="Primary navigation"
            className="relative z-10 hidden items-center gap-1 lg:flex"
          >
            {headerNavItems.map((item) => {
              const isActive = isActivePath(pathname, item.href)

              return (
                <Link
                  className={cn(
                    // Base: Space Mono micro-caps for the brand data-label feel
                    'rounded-full px-4 py-2 font-mono text-[0.68rem] uppercase leading-none tracking-[0.18em]',
                    // Contrast fix: navy at full opacity so it reads on the glass pill
                    'text-[var(--pn-navy)] transition-colors duration-200',
                    // Hover: subtle white fill + sage text
                    'hover:bg-white/50 hover:text-[var(--pn-sage)]',
                    // Focus ring
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)]',
                    // Active: sage pill with white text — clear selected state
                    isActive &&
                      'bg-[var(--pn-sage)] text-white hover:bg-[var(--pn-sage-dark)] hover:text-white',
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right-side actions: search icon, CTA button, mobile menu trigger */}
          <div className="relative z-10 flex items-center gap-2">
            {/* Search icon — hidden on smallest screens */}
            <Link
              aria-label="Search PinNepal"
              className={cn(
                'hidden size-10 items-center justify-center rounded-full',
                // Navy at full opacity for contrast
                'text-[var(--pn-navy)] transition-colors',
                'hover:bg-white/50 hover:text-[var(--pn-sage)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)] md:inline-flex',
              )}
              href="/search"
            >
              <Search aria-hidden="true" className="size-[1.125rem]" />
            </Link>

            {/*
             * Primary CTA — sage pill that switches to navy on hover.
             * text-shadow-sm removed because it was clashing with the glass bg.
             */}
            <Link
              className={cn(
                'hidden rounded-full bg-[var(--pn-sage)] px-5 py-2.5 font-mono text-[0.62rem] uppercase',
                'leading-none tracking-[0.18em] text-white transition-colors',
                'hover:bg-[var(--pn-navy)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)] md:inline-flex',
              )}
              href="/tour-packages"
            >
              Book a trip
            </Link>

            {/* Mobile hamburger — only shows below lg breakpoint */}
            <button
              aria-expanded={isMenuOpen}
              aria-label="Open navigation"
              className={cn(
                'inline-flex size-11 items-center justify-center rounded-full',
                'text-[var(--pn-navy)] transition-colors',
                'hover:bg-white/50 hover:text-[var(--pn-sage)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)] lg:hidden',
              )}
              onClick={() => setIsMenuOpen(true)}
              type="button"
            >
              <Menu aria-hidden="true" className="size-5" />
            </button>
          </div>
        </motion.div>
      </motion.header>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile slide-in menu                                                 */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div className="pointer-events-auto fixed inset-0 z-[60] lg:hidden">
            {/* Backdrop — clicking it closes the menu */}
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close navigation backdrop"
              className="absolute inset-0 bg-[rgba(28,46,94,0.36)] backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={closeMenu}
              transition={{ duration: 0.18 }}
              type="button"
            />

            {/* Slide-in panel */}
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
              transition={{
                duration: shouldReduceMotion ? 0.12 : 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Panel header: logo + close button */}
              <div className="flex items-center justify-between gap-4">
                <Link
                  aria-label="PinNepal home"
                  className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)]"
                  href="/"
                  onClick={closeMenu}
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
                  onClick={closeMenu}
                  type="button"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>

              {/* Nav section */}
              <div className="mt-12">
                {/* Eyebrow label — Space Mono brand-data style */}
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
                        onClick={closeMenu}
                      >
                        <span className="flex items-center justify-between gap-4">
                          {/* Serif headline — Playfair Display from brand system */}
                          <span className="font-serif text-2xl font-bold leading-tight text-[var(--pn-navy)]">
                            {item.label}
                          </span>

                          {/* Orange arrow — Road Orange accent, nudges on hover */}
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

              {/* Panel footer: CTA */}
              <div className="mt-auto border-t border-[var(--pn-border)] pt-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[var(--pn-mist)]">
                  Kathmandu local team
                </p>

                <Link
                  className={cn(
                    'mt-4 inline-flex w-full items-center justify-center rounded-[var(--radius-btn)]',
                    'bg-[var(--pn-sage)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.06em]',
                    'text-white transition-colors hover:bg-[var(--pn-sage-dark)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pn-sage)]',
                  )}
                  href="/tour-packages"
                  onClick={closeMenu}
                >
                  View the itineraries
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
