import type { Metadata } from 'next/types'

import { DestinationArchive } from '@/components/DestinationArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { notFound } from 'next/navigation'
import React from 'react'
import {
  DESTINATIONS_PER_PAGE,
  generateDestinationCategoryStaticParams,
  queryDestinationCategoryBySlug,
  queryDestinationsByCategory,
} from '../../queries'

type Args = {
  params: Promise<{
    categorySlug: string
    pageNumber: string
  }>
}

export default async function DestinationCategoryPaginatedPage({ params: paramsPromise }: Args) {
  const { categorySlug, pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const decodedCategorySlug = decodeURIComponent(categorySlug)
  const category = await queryDestinationCategoryBySlug(decodedCategorySlug)

  if (!category) notFound()

  const destinations = await queryDestinationsByCategory({
    categoryID: category.id,
    page: sanitizedPageNumber,
  })

  return (
    <main className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose max-w-none">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Destination category
          </p>
          <h1>{category.title}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="destinations"
          currentPage={destinations.page}
          limit={DESTINATIONS_PER_PAGE}
          totalDocs={destinations.totalDocs}
        />
      </div>

      <DestinationArchive destinations={destinations.docs} />

      <div className="container">
        {destinations.totalPages > 1 && destinations.page && (
          <Pagination
            basePath={`/destinations/category/${category.slug}`}
            page={destinations.page}
            totalPages={destinations.totalPages}
          />
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { categorySlug, pageNumber } = await paramsPromise
  const category = await queryDestinationCategoryBySlug(decodeURIComponent(categorySlug))

  if (!category) {
    return {
      title: 'Destination Category | PinNepal',
    }
  }

  return {
    title: `${category.title} Destinations Page ${pageNumber} | PinNepal`,
  }
}

export async function generateStaticParams() {
  const categories = await generateDestinationCategoryStaticParams()

  return categories.map(({ categorySlug }) => ({
    categorySlug,
    pageNumber: '1',
  }))
}
