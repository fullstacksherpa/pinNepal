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
} from './queries'

type Args = {
  params: Promise<{
    categorySlug: string
  }>
}

export const revalidate = 600

export default async function TourPackageCategoryPage({ params: paramsPromise }: Args) {
  const { categorySlug } = await paramsPromise
  const decodedCategorySlug = decodeURIComponent(categorySlug)
  const category = await queryTourPackageCategoryBySlug(decodedCategorySlug)

  if (!category) notFound()

  const tourPackages = await queryTourPackagesByCategory({
    categoryID: category.id,
    page: 1,
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
  const { categorySlug } = await paramsPromise
  const category = await queryTourPackageCategoryBySlug(decodeURIComponent(categorySlug))

  if (!category) {
    return {
      title: 'Tour Package Category | PinNepal',
    }
  }

  return {
    title: `${category.title} Tour Packages | PinNepal`,
  }
}

export const generateStaticParams = generateTourPackageCategoryStaticParams
