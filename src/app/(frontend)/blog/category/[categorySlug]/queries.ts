import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const BLOGS_PER_PAGE = 12

export const blogArchiveSelect = {
  title: true,
  authors: true,
  slug: true,
  categories: true,
  meta: true,
  populatedAuthors: true,
} as const

export const queryBlogCategoryBySlug = cache(async (categorySlug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'blog-categories',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    select: {
      title: true,
      slug: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
    },
    where: {
      slug: {
        equals: categorySlug,
      },
    },
  })

  return result.docs?.[0] || null
})

export const queryBlogsByCategory = cache(
  async ({ categoryID, page }: { categoryID: number | string; page: number }) => {
    const payload = await getPayload({ config: configPromise })

    return payload.find({
      collection: 'blogs',
      depth: 1,
      limit: BLOGS_PER_PAGE,
      overrideAccess: false,
      page,
      select: blogArchiveSelect,
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

export const generateCategoryStaticParams = async () => {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'blog-categories',
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
