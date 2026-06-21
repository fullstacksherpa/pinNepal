import 'dotenv/config'

import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import { randomUUID } from 'node:crypto'

import config from '../../src/payload.config'
import type { Blog } from '../../src/payload-types'
import { redirects } from '../../redirects'
import {
  queryBlogCategoryBySlug,
  queryBlogsByCategory,
} from '../../src/app/(frontend)/blog/category/[categorySlug]/queries'

let payload: Payload
let blogID: number | null = null
let categoryID: number | null = null

const content: Blog['content'] = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Temporary category routing blog.',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}

describe('blog routing', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterEach(async () => {
    if (blogID) {
      await payload.delete({
        collection: 'blogs',
        context: {
          disableRevalidate: true,
        },
        id: blogID,
      })
      blogID = null
    }

    if (categoryID) {
      await payload.delete({
        collection: 'blog-categories',
        context: {
          disableRevalidate: true,
        },
        id: categoryID,
      })
      categoryID = null
    }
  })

  it('redirects legacy plural blog URLs to singular blog URLs', async () => {
    const rules = redirects ? await redirects() : []

    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          destination: '/blog/:path*',
          permanent: true,
          source: '/blogs/:path*',
        }),
        expect.objectContaining({
          destination: '/blog-sitemap.xml',
          permanent: true,
          source: '/blogs-sitemap.xml',
        }),
      ]),
    )
  })

  it('queries blogs by category slug for category listing routes', async () => {
    const suffix = randomUUID()
    const slug = `vitest-category-${suffix}`

    const category = await payload.create({
      collection: 'blog-categories',
      context: {
        disableRevalidate: true,
      },
      data: {
        title: `Vitest Category ${suffix}`,
        slug,
      },
    })
    categoryID = category.id

    const blog = await payload.create({
      collection: 'blogs',
      context: {
        disableRevalidate: true,
      },
      data: {
        _status: 'published',
        categories: [category.id],
        content,
        slug: `vitest-blog-${suffix}`,
        title: `Vitest Blog ${suffix}`,
      },
    })
    blogID = blog.id

    const queriedCategory = await queryBlogCategoryBySlug(slug)
    expect(queriedCategory?.id).toBe(category.id)

    const blogs = await queryBlogsByCategory({
      categoryID: category.id,
      page: 1,
    })

    expect(blogs.docs.map((doc) => doc.id)).toContain(blog.id)
  })
})
