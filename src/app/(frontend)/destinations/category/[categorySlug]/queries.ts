import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const DESTINATIONS_PER_PAGE = 12

export const destinationArchiveSelect = {
  id: true,
  bestTimeToVisit: true,
  categories: true,
  difficulty: true,
  district: true,
  heroImage: true,
  name: true,
  recommendedDuration: true,
  slug: true,
  summary: true,
} as const

export const queryDestinationCategoryBySlug = cache(async (categorySlug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'destination-categories',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    select: {
      title: true,
      slug: true,
    },
    where: {
      slug: {
        equals: categorySlug,
      },
    },
  })

  return result.docs?.[0] || null
})

export const queryDestinationsByCategory = cache(
  async ({ categoryID, page }: { categoryID: number | string; page: number }) => {
    const payload = await getPayload({ config: configPromise })

    return payload.find({
      collection: 'destinations',
      depth: 2,
      limit: DESTINATIONS_PER_PAGE,
      overrideAccess: false,
      page,
      select: destinationArchiveSelect,
      where: {
        and: [
          {
            categories: {
              equals: categoryID,
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
  },
)

export const generateDestinationCategoryStaticParams = async () => {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'destination-categories',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return categories.docs.flatMap((category) =>
    category.slug
      ? [
          {
            categorySlug: category.slug,
          },
        ]
      : [],
  )
}
