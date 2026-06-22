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
      categories: true,
      meta: true,
      populatedAuthors: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose max-w-none">
          <h1>Blogs</h1>
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
