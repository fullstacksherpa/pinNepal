import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { notFound } from 'next/navigation'
import React from 'react'
import { TourPackageArchive } from '@/components/TourPackageArchive'
import {
  generateTourPackageCategoryStaticParams,
  queryTourPackageCategoryBySlug,
  queryTourPackagesByCategory,
  TOUR_PACKAGES_PER_PAGE,
} from '../../queries'

type Args = {
  params: Promise<{
    categorySlug: string
    pageNumber: string
  }>
}

export const revalidate = 600

export default async function TourPackageCategoryPaginatedPage({ params: paramsPromise }: Args) {
  const { categorySlug, pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const category = await queryTourPackageCategoryBySlug(decodeURIComponent(categorySlug))

  if (!category) notFound()

  const tourPackages = await queryTourPackagesByCategory({
    categoryID: category.id,
    page: sanitizedPageNumber,
  })

  return (
    <main className="pb-24 pt-24">
      <div className="container mb-16">
        <div className="prose max-w-none">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Tour package category
          </p>
          <h1>{category.title}</h1>
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
            basePath={`/tour-packages/category/${category.slug}`}
            page={tourPackages.page}
            totalPages={tourPackages.totalPages}
          />
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { categorySlug, pageNumber } = await paramsPromise
  const category = await queryTourPackageCategoryBySlug(decodeURIComponent(categorySlug))

  return {
    title: category
      ? `${category.title} Tour Packages Page ${pageNumber} | PinNepal`
      : 'Tour Package Category | PinNepal',
  }
}

export const generateStaticParams = async () => {
  const categoryParams = await generateTourPackageCategoryStaticParams()

  return categoryParams.map((params) => ({
    ...params,
    pageNumber: '1',
  }))
}
