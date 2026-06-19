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

export const revalidate = 600

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
        <div className="prose max-w-none">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Blog category
          </p>
          <h1>{category.title}</h1>
          {category.description && <p>{category.description}</p>}
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
