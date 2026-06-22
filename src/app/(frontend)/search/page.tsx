import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardBlogData } from '@/components/Card'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--pn-mist)]">
            Find your route
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight text-[var(--pn-navy)]">
            Search PinNepal
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--pn-navy)]">
            Look up destinations, tour packages, route notes, and practical Nepal travel guides.
          </p>

          <div className="mx-auto mt-8 max-w-[50rem]">
            <Search />
          </div>
        </div>
      </div>

      {blogs.totalDocs > 0 ? (
        <CollectionArchive blogs={blogs.docs as CardBlogData[]} />
      ) : (
        <div className="container text-[var(--pn-body)]">No route notes found for this search.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'PinNepal Search',
  }
}
