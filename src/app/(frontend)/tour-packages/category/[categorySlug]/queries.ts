import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

export const TOUR_PACKAGES_PER_PAGE = 12

export const tourPackageArchiveSelect = {
  id: true,
  availabilityStatus: true,
  categories: true,
  coverImage: true,
  currency: true,
  difficultyLevel: true,
  endLocation: true,
  pricePerPerson: true,
  rating: true,
  region: true,
  reviewCount: true,
  slug: true,
  startLocation: true,
  tagline: true,
  title: true,
  totalDays: true,
  totalNights: true,
} as const

const publicTourPackageConstraints: Where[] = [
  {
    _status: {
      equals: 'published',
    },
  },
  {
    availabilityStatus: {
      equals: 'active',
    },
  },
]

const publicTourPackageWhere: Where = {
  and: publicTourPackageConstraints,
}

export const queryTourPackages = cache(async ({ page }: { page: number }) => {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'tour-packages',
    depth: 2,
    limit: TOUR_PACKAGES_PER_PAGE,
    overrideAccess: false,
    page,
    select: tourPackageArchiveSelect,
    where: publicTourPackageWhere,
  })
})

export const queryTourPackageCategoryBySlug = cache(async (categorySlug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'tour-package-categories',
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

export const queryTourPackagesByCategory = cache(
  async ({ categoryID, page }: { categoryID: number | string; page: number }) => {
    const payload = await getPayload({ config: configPromise })

    return payload.find({
      collection: 'tour-packages',
      depth: 2,
      limit: TOUR_PACKAGES_PER_PAGE,
      overrideAccess: false,
      page,
      select: tourPackageArchiveSelect,
      where: {
        and: [
          {
            categories: {
              equals: categoryID,
            },
          },
          ...publicTourPackageConstraints,
        ],
      },
    })
  },
)

export const generateTourPackageCategoryStaticParams = async () => {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'tour-package-categories',
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
