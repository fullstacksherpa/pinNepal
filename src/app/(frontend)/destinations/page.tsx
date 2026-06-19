import type { Metadata } from 'next/types'

import { DestinationArchive } from '@/components/DestinationArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function DestinationsPage() {
  const payload = await getPayload({ config: configPromise })

  const destinations = await payload.find({
    collection: 'destinations',
    depth: 2,
    limit: 12,
    overrideAccess: false,
    select: {
      id: true,
      bestTimeToVisit: true,
      categories: true,
      difficulty: true,
      district: true,
      heroImage: true,
      name: true,
      recommendedDuration: true,
      slug: true,
      summary: true,
    },
  })

  return (
    <main className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose max-w-none">
          <h1>Destinations</h1>
          <p>Explore places across Nepal by district, province, category, and travel style.</p>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="destinations"
          currentPage={destinations.page}
          limit={12}
          totalDocs={destinations.totalDocs}
        />
      </div>

      <DestinationArchive destinations={destinations.docs} />

      <div className="container">
        {destinations.totalPages > 1 && destinations.page && (
          <Pagination
            basePath="/destinations"
            page={destinations.page}
            totalPages={destinations.totalPages}
          />
        )}
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Destinations | PinNepal',
  }
}
