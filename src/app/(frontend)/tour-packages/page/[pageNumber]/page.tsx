import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import React from 'react'
import { TourPackageArchive } from '@/components/TourPackageArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { queryTourPackages, TOUR_PACKAGES_PER_PAGE } from '../../category/[categorySlug]/queries'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function TourPackagesPaginatedPage({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const tourPackages = await queryTourPackages({ page: sanitizedPageNumber })

  return (
    <main className="pb-24 pt-24">
      <div className="container mb-16">
        <div className="prose max-w-none">
          <h1>Tour Packages</h1>
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise

  return {
    title: `Tour Packages Page ${pageNumber} | PinNepal`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'tour-packages',
    overrideAccess: false,
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          availabilityStatus: {
            equals: 'active',
          },
        },
      ],
    },
  })

  const totalPages = Math.ceil(totalDocs / TOUR_PACKAGES_PER_PAGE)
  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
