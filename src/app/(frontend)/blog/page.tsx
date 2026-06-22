import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-static'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'blogs',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      authors: true,
      slug: true,
      heroImage: true,
      categories: true,
      meta: true,
      populatedAuthors: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="max-w-3xl">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--pn-mist)]">
            Field notes and route guides
          </p>
          <h1 className="mt-3 font-serif text-5xl font-bold leading-tight text-[var(--pn-navy)]">
            Stories
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--pn-navy)]">
            Read practical notes on routes, permits, weather windows, and travel days across Nepal.
          </p>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="blogs"
          currentPage={blogs.page}
          limit={12}
          totalDocs={blogs.totalDocs}
        />
      </div>

      <CollectionArchive blogs={blogs.docs} />

      <div className="container">
        {blogs.totalPages > 1 && blogs.page && (
          <Pagination basePath="/blog" page={blogs.page} totalPages={blogs.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'PinNepal Stories',
  }
}
