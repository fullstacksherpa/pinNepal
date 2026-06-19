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
} from './queries'

type Args = {
  params: Promise<{
    categorySlug: string
  }>
}

export const revalidate = 600

export default async function DestinationCategoryPage({ params: paramsPromise }: Args) {
  const { categorySlug } = await paramsPromise
  const decodedCategorySlug = decodeURIComponent(categorySlug)
  const category = await queryDestinationCategoryBySlug(decodedCategorySlug)

  if (!category) notFound()

  const destinations = await queryDestinationsByCategory({
    categoryID: category.id,
    page: 1,
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
  const { categorySlug } = await paramsPromise
  const category = await queryDestinationCategoryBySlug(decodeURIComponent(categorySlug))

  if (!category) {
    return {
      title: 'Destination Category | PinNepal',
    }
  }

  return {
    title: `${category.title} Destinations | PinNepal`,
  }
}

export const generateStaticParams = generateDestinationCategoryStaticParams
