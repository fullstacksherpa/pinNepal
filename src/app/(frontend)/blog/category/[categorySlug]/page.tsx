import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { notFound } from 'next/navigation'
import React from 'react'
import {
  BLOGS_PER_PAGE,
  generateCategoryStaticParams,
  queryBlogCategoryBySlug,
  queryBlogsByCategory,
} from './queries'

type Args = {
  params: Promise<{
    categorySlug: string
  }>
}

export default async function BlogCategoryPage({ params: paramsPromise }: Args) {
  const { categorySlug } = await paramsPromise
  const decodedCategorySlug = decodeURIComponent(categorySlug)
  const category = await queryBlogCategoryBySlug(decodedCategorySlug)

  if (!category) notFound()

  const blogs = await queryBlogsByCategory({
    categoryID: category.id,
    page: 1,
  })

  return (
    <main className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="max-w-3xl">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--pn-mist)]">
            Blog category
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight text-[var(--pn-navy)]">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-5 text-lg leading-8 text-[var(--pn-navy)]">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="blogs"
          currentPage={blogs.page}
          limit={BLOGS_PER_PAGE}
          totalDocs={blogs.totalDocs}
        />
      </div>

      <CollectionArchive blogs={blogs.docs} />

      <div className="container">
        {blogs.totalPages > 1 && blogs.page && (
          <Pagination
            basePath={`/blog/category/${category.slug}`}
            page={blogs.page}
            totalPages={blogs.totalPages}
          />
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { categorySlug } = await paramsPromise
  const category = await queryBlogCategoryBySlug(decodeURIComponent(categorySlug))

  if (!category) {
    return {
      title: 'Blog Category | PinNepal',
    }
  }

  return {
    description: category.metaDescription || category.description || undefined,
    title: `${category.metaTitle || category.title} | PinNepal`,
  }
}

export const generateStaticParams = generateCategoryStaticParams
