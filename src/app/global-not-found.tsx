// 1. Import global styles (required because layout.tsx is bypassed)
import './(frontend)/globals.css'

// 2. Import and configure fonts to support your Tailwind classes (font-sans, font-serif)
import { Inter, Playfair_Display } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Maps to your tailwind font-sans usually
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif', // Maps to your tailwind font-serif usually
})

// 3. Export Metadata
export const metadata: Metadata = {
  title: '404 - Trail Not Found | PinNepal',
  description: 'The route you were looking for may have moved. Head back to base camp.',
}

// 4. No props are accepted
export default function GlobalNotFound() {
  return (
    // 5. MUST return full HTML document
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      {/* Add basic body resets just in case your globals.css relies on layout.tsx for them */}
      <body className="m-0 p-0">
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#457b5d] px-6 font-sans text-white">
          {/* 1. HEADER / NAV */}
          <header className="absolute left-0 top-0 w-full p-4 md:p-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/20 bg-white/5 px-6 py-3 backdrop-blur-md">
              <Link
                href="/"
                aria-label="PinNepal home"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <Logo compact loading="eager" priority="high" variant="light" />
              </Link>
              <Link
                href="/"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-[#457b5d] transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Back to Home
              </Link>
            </div>
          </header>

          {/* 2. MAIN CONTENT */}
          <div className="relative z-10 mx-auto mt-20 flex max-w-2xl flex-col items-center text-center">
            {/* 404 Tag */}
            <div className="mb-8 rounded border border-[#f45a31] px-4 py-1.5 text-sm font-bold tracking-[0.2em] text-[#f45a31]">
              ▲ 404m &middot; TRAIL NOT FOUND
            </div>

            {/* Headings */}
            <h1 className="mb-4 font-serif text-6xl font-bold tracking-tight text-white md:text-8xl">
              Off the path.
            </h1>
            <p className="mb-10 font-serif text-2xl italic text-white/90 md:text-3xl">
              Even the best guides take a wrong turn.
            </p>

            {/* Dots Divider */}
            <div className="mb-10 flex gap-3">
              <span className="size-2.5 rounded-full bg-[#f45a31]"></span>
              <span className="size-2.5 rounded-full bg-white/30"></span>
              <span className="size-2.5 rounded-full bg-white/30"></span>
            </div>

            {/* Body Copy */}
            <p className="mb-12 text-lg leading-relaxed text-white/90 md:text-xl">
              This page doesn&apos;t exist — but <strong className="text-white">Nepal does</strong>,
              and it&apos;s waiting. The route you were looking for may have moved, or you may have
              taken a fork that leads nowhere. Happens above 4,000m. Head back to base.
            </p>

            {/* Buttons */}
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="flex items-center justify-center rounded bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#457b5d] transition-transform hover:-translate-y-0.5"
              >
                Return to Base Camp
              </Link>
              <Link
                href="/tour-packages"
                className="flex items-center justify-center rounded border border-white/50 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
              >
                Browse Packages &rarr;
              </Link>
            </div>
          </div>

          {/* 3. MOUNTAIN FOOTER GRAPHIC */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden">
            {/* Stats overlay */}
            <div className="absolute bottom-4 left-0 z-20 flex w-full justify-between px-4 font-mono text-xs font-semibold tracking-widest md:px-12 md:text-sm lg:px-24">
              <div className="hidden flex-col items-center sm:flex">
                <span className="text-[#f45a31]">8,849m</span>
                <span className="text-white/70">Sagarmatha</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#f45a31]">5,364m</span>
                <span className="text-white/70">Base Camp</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[#f45a31]">5,416m</span>
                <span className="text-white/70">Thorong La</span>
              </div>
              <div className="hidden flex-col items-center md:flex">
                <span className="text-[#f45a31]">340 km</span>
                <span className="text-white/70">Moto Route</span>
              </div>
              <div className="hidden flex-col items-center lg:flex">
                <span className="text-[#f45a31]">8,091m</span>
                <span className="text-white/70">Annapurna</span>
              </div>
            </div>

            {/* SVG Low-Poly Mountains */}
            <svg
              viewBox="0 0 1440 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 h-[120px] w-full object-cover opacity-80 md:h-[200px]"
              preserveAspectRatio="none"
            >
              {/* Back layer */}
              <path
                d="M0 100L200 50L450 150L700 20L950 120L1200 40L1440 110V200H0V100Z"
                fill="rgba(255,255,255,0.05)"
              />
              {/* Middle layer */}
              <path
                d="M0 150L150 80L350 180L600 60L850 170L1100 80L1350 160L1440 130V200H0V150Z"
                fill="rgba(255,255,255,0.08)"
              />
              {/* Front layer */}
              <path
                d="M0 200L250 120L500 200L750 100L1000 200L1250 140L1440 200H0Z"
                fill="rgba(255,255,255,0.12)"
              />
            </svg>
          </div>
        </main>
      </body>
    </html>
  )
}
