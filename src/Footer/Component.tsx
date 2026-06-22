import { footerNavGroups } from '@/constants'
import { ArrowRight, Compass, MapPinned, Route } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'

// Future edit:
// Add/remove elevation markers here without touching the footer JSX.
// `meters` is kept as a number so we can format it cleanly.
const footerElevations = [
  { name: 'Sagarmatha', meters: 8849 },
  { name: 'Kanchenjunga', meters: 8586 },
  { name: 'Lhotse', meters: 8516 },
  { name: 'Makalu', meters: 8485 },
  { name: 'Dhaulagiri', meters: 8167 },
  { name: 'Manaslu', meters: 8163 },
  { name: 'Annapurna', meters: 8091 },
  { name: 'Ama Dablam', meters: 6812 },
  { name: 'Everest Base Camp', meters: 5364 },
  { name: 'Thorong La', meters: 5416 },
]

// Future edit:
// Keep the elevation value clean: 8849 -> 8849M.
function formatElevation(meters: number) {
  return `${meters}M`
}

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-(--pn-sage-dark) text-white">
      {/* 
        Main footer content.
        Bottom padding leaves space for the mountain background and final brand line.
      */}
      <div className="container relative z-20 py-12 pb-64 md:py-16 md:pb-72">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-black/10 p-5 backdrop-blur-sm md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-0">
            <Link
              aria-label="PinNepal home"
              className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              href="/"
            >
              <Logo variant="light" />
            </Link>

            <p className="mt-6 text-base leading-7 text-white/85">
              Born in the Himalayas and run by the Sherpas who know them best, PinNepal is your
              ultimate all-access pass to adventure. From epic trekking packages and raw road
              journeys to a deep vault of insider travel notes, we’ve got your back. Let us be your
              compass to the real Nepal — with us leading the way, you won&apos;t miss a single
              hidden gem.
            </p>

            <div className="mt-7 grid gap-3 text-sm font-medium text-white/82 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-center gap-3 border-l-2 border-(--pn-orange) bg-white/4 px-3 py-2">
                <MapPinned aria-hidden="true" className="size-4 text-(--pn-orange)" />
                <span>Kathmandu based</span>
              </div>

              <div className="flex items-center gap-3 border-l-2 border-(--pn-orange) bg-white/4 px-3 py-2">
                <Route aria-hidden="true" className="size-4 text-(--pn-orange)" />
                <span>Treks and motorbike routes</span>
              </div>

              <div className="flex items-center gap-3 border-l-2 border-(--pn-orange) bg-white/4 px-3 py-2">
                <Compass aria-hidden="true" className="size-4 text-(--pn-orange)" />
                <span>Permit-aware planning</span>
              </div>
            </div>
          </div>

          {/* 
            Footer navigation.

            Important mobile change:
            - grid-cols-3 applies immediately on mobile.
            - This makes Explore / Packages / Guides sit side-by-side on mobile.
            - gap-x-3 keeps the columns tighter on small screens.
            - sm:gap-x-8 increases breathing room on larger screens.
          */}
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-3 gap-x-3 gap-y-6 rounded-2xl border border-white/10 bg-black/10 p-4 backdrop-blur-sm sm:gap-x-8 sm:p-5 lg:justify-self-end lg:gap-x-12"
          >
            {footerNavGroups.map((group) => (
              <div key={group.label} className="min-w-0">
                <h2 className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.28em] text-white/58 sm:text-[0.64rem]">
                  {group.label}
                </h2>

                {/* 
                  Keep links vertical inside each footer group.

                  This matches your screenshot:
                  Explore column:
                  - Destinations
                  - Destination categories
                  - Search

                  Packages column:
                  - Tour packages
                  - Package categories

                  Guides column:
                  - Stories
                  - Story categories
                */}
                <ul className="mt-4 grid gap-2.5 sm:gap-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="block text-xs font-semibold leading-5 text-white/84 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:text-sm"
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

        {/* 
          Elevation console.
          The values use tabular mono numbers, extra tracking, glow, and a tiny “ALT” label
          to create a sci-fi expedition dashboard feel.
        */}
        <div className="mt-12 border-t border-white/15 pt-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-white">
                Nepal elevation console
              </p>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
                High peaks, base camps, and mountain passes that shape the PinNepal trail map.
              </p>
            </div>

            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-(--pn-orange)">
              Altitude index / Himalaya
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-3 md:gap-3 lg:grid-cols-5">
            {footerElevations.map((item) => (
              <div
                key={item.name}
                className="group relative overflow-hidden border border-white/15 bg-[#081813]/70 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-md transition-colors hover:border-(--pn-orange)/60"
              >
                {/* 
                  Thin top line.
                  This gives each chip a technical instrument-panel feel.
                */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-(--pn-orange) via-white/30 to-transparent"
                />

                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[0.52rem] font-bold uppercase tracking-[0.3em] text-white/46">
                    ALT
                  </p>

                  <span className="h-1.5 w-1.5 rounded-full bg-(--pn-orange) shadow-[0_0_14px_rgba(244,90,49,0.9)]" />
                </div>

                <p
                  className="mt-3 font-mono text-lg font-black leading-none tracking-[0.18em] text-(--pn-orange) tabular-nums sm:text-xl"
                  style={{
                    textShadow: '0 0 10px rgba(244,90,49,0.55), 0 0 26px rgba(244,90,49,0.18)',
                  }}
                >
                  {formatElevation(item.meters)}
                </p>

                <p className="mt-2 text-xs font-semibold text-white/78">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 
        Bottom mountain system.
        Absolute background inspired by your 404 page.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden">
        <svg
          viewBox="0 0 1440 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-55 w-full md:h-67.5"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Distant haze */}
          <path
            d="M0 118L160 80L320 138L480 62L640 126L800 48L980 136L1160 76L1440 126V280H0V118Z"
            fill="rgba(255,255,255,0.06)"
          />

          {/* Back mountain layer */}
          <path
            d="M0 158L120 100L240 158L380 74L520 168L700 58L850 166L1020 92L1180 158L1320 96L1440 148V280H0V158Z"
            fill="rgba(255,255,255,0.1)"
          />

          {/* Middle mountain layer */}
          <path
            d="M0 198L110 132L220 188L350 98L490 204L620 124L760 188L900 96L1060 204L1210 132L1440 196V280H0V198Z"
            fill="rgba(255,255,255,0.15)"
          />

          {/* Front mountain layer */}
          <path
            d="M0 238L130 164L260 230L390 136L520 238L650 158L780 234L930 146L1080 240L1230 170L1440 238V280H0V238Z"
            fill="rgba(255,255,255,0.22)"
          />
        </svg>

        {/* 
          Bottom-most brand line.
          This is intentionally placed over the mountains so the final text is readable.
        */}
        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-5 pt-2 text-center">
          <p className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
            PinNepal awaits you.
          </p>

          <p className="mt-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white">
            Travel & Adventure / Nepal / Since the first trail
          </p>
        </div>
      </div>
    </footer>
  )
}
