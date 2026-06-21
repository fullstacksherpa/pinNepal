import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { TourPackageArchive } from '@/components/TourPackageArchive'
import { queryTourPackages, TOUR_PACKAGES_PER_PAGE } from './category/[categorySlug]/queries'

export const dynamic = 'force-static'

export default async function TourPackagesPage() {
  const tourPackages = await queryTourPackages({ page: 1 })

  return (
    <main className="pb-24 pt-24">
      <div className="container mb-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#B23A48]">
            Guided journeys across Nepal
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight">Tour Packages</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Compare multi-day treks, cultural routes, wildlife trips, and private adventures built
            around Nepal&apos;s trails, temples, and remote valleys.
          </p>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="tour-packages"
          currentPage={tourPackages.page}
          limit={TOUR_PACKAGES_PER_PAGE}
          totalDocs={tourPackages.totalDocs}
        />
      </div>

      <TourPackageArchive tourPackages={tourPackages.docs} />

      <div className="container">
        {tourPackages.totalPages > 1 && tourPackages.page && (
          <Pagination
            basePath="/tour-packages"
            page={tourPackages.page}
            totalPages={tourPackages.totalPages}
          />
        )}
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Tour Packages | PinNepal',
  }
}
