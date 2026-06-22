import type { Metadata } from 'next/types'

import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'

export default async function BlogCategoriesPage() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'blog-categories',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: {
      title: true,
      slug: true,
      description: true,
      image: true,
    },
    sort: 'title',
  })

  const counts = await Promise.all(
    categories.docs.map(async (category) => {
      const result = await payload.count({
        collection: 'blogs',
        overrideAccess: false,
        where: {
          and: [
            {
              categories: {
                equals: category.id,
              },
            },
            {
              _status: {
                equals: 'published',
              },
            },
          ],
        },
      })

      return [category.id, result.totalDocs] as const
    }),
  )

  const countByCategoryID = new Map<number, number>(counts)

  return (
    <main className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="max-w-3xl">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--pn-mist)]">
            Guide topics
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight text-[var(--pn-navy)]">
            Story Categories
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--pn-navy)]">
            Browse route guides, planning notes, and Nepal travel stories by topic.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8">
          {categories.docs.map((category) => {
            if (!category.slug) return null

            const image = category.image
            const blogCount = countByCategoryID.get(category.id) || 0

            return (
              <Link
                className="group col-span-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--pn-border)] bg-white transition-colors hover:bg-[var(--pn-sage-light)]"
                href={`/blog/category/${category.slug}`}
                key={category.id}
              >
                <article>
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--pn-sage)]">
                    {image && typeof image === 'object' ? (
                      <Media
                        fill
                        imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                        pictureClassName="block h-full w-full"
                        resource={image}
                        size="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-white/80">
                        {category.title}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[var(--pn-mist)]">
                      {blogCount} {blogCount === 1 ? 'blog' : 'blogs'}
                    </p>
                    <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-[var(--pn-navy)]">
                      {category.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--pn-body)]">
                      {category.description || 'Stories and travel notes from this category.'}
                    </p>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Blog Categories | PinNepal',
  }
}
