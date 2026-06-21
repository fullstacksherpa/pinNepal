import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'

export default async function DestinationCategoriesPage() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'destination-categories',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: {
      title: true,
      slug: true,
    },
    sort: 'title',
  })

  const counts = await Promise.all(
    categories.docs.map(async (category) => {
      const result = await payload.count({
        collection: 'destinations',
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
        <div className="prose max-w-none">
          <h1>Destination Categories</h1>
          <p>Browse Nepal destinations by travel style and experience.</p>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8">
          {categories.docs.map((category) => {
            if (!category.slug) return null

            const destinationCount = countByCategoryID.get(category.id) || 0

            return (
              <Link
                className="group col-span-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
                href={`/destinations/category/${category.slug}`}
                key={category.id}
              >
                <article>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {destinationCount} {destinationCount === 1 ? 'destination' : 'destinations'}
                  </p>
                  <h2 className="mt-4 text-2xl font-medium leading-tight">{category.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Explore places for {category.title.toLowerCase()} across Nepal.
                  </p>
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
    title: 'Destination Categories | PinNepal',
  }
}
