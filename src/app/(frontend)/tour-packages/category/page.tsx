import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function TourPackageCategoryIndexPage() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'tour-package-categories',
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'title',
    select: {
      slug: true,
      title: true,
    },
  })

  return (
    <main className="pb-24 pt-24">
      <div className="container mb-14">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#B23A48]">
            Travel styles
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight">Tour Package Categories</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Browse guided Nepal journeys by trip style, from trekking expeditions to cultural,
            wildlife, pilgrimage, and private itineraries.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.docs.map((category) => (
            <Link
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent"
              href={`/tour-packages/category/${category.slug}`}
              key={category.id}
            >
              <span className="text-lg font-medium">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Tour Package Categories | PinNepal',
  }
}
