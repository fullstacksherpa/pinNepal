import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getDestinationsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const destinations = await payload.find({
      collection: 'destinations',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const categories = await payload.find({
      collection: 'destination-categories',
      depth: 0,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const destinationSitemap = destinations.docs
      ? destinations.docs
          .filter((destination) => Boolean(destination?.slug))
          .map((destination) => ({
            loc: `${SITE_URL}/destinations/${destination?.slug}`,
            lastmod: destination.updatedAt || dateFallback,
          }))
      : []

    const categorySitemap = categories.docs
      ? categories.docs
          .filter((category) => Boolean(category?.slug))
          .map((category) => ({
            loc: `${SITE_URL}/destinations/category/${category?.slug}`,
            lastmod: category.updatedAt || dateFallback,
          }))
      : []

    return [
      {
        loc: `${SITE_URL}/destinations`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/destinations/category`,
        lastmod: dateFallback,
      },
      ...categorySitemap,
      ...destinationSitemap,
    ]
  },
  ['destinations-sitemap'],
  {
    tags: ['destinations-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getDestinationsSitemap()

  return getServerSideSitemap(sitemap)
}
