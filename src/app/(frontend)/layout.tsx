import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Playfair_Display, Source_Sans_3, Space_Mono } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { FAQSection } from '@/components/FAQSection'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const playfairDisplay = Playfair_Display({
  display: 'swap',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-pn-display',
  weight: ['400', '700'],
})

const sourceSans = Source_Sans_3({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-pn-body',
  weight: ['300', '400', '600'],
})

const spaceMono = Space_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-pn-mono',
  weight: ['400', '700'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(playfairDisplay.variable, sourceSans.variable, spaceMono.variable)}
      data-scroll-behavior="smooth"
      data-theme="light"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />

        {/* Preload the main background image to boost rendering speed */}
        <link rel="preload" href="/images/bgmain.jpg" as="image" />
      </head>

      <body
        style={{ backgroundImage: 'url("/images/bgmain.jpg")' }}
        // Added standard Tailwind utility classes to ensure the background
        // fills the screen properly without repeating or breaking on mobile.
        className="bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
      >
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <FAQSection />
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: 'Ongchen',
  },
}
