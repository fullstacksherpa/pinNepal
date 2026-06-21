import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

const timedRevalidationRoutes = [
  'src/app/(frontend)/blog/page.tsx',
  'src/app/(frontend)/blog/page/[pageNumber]/page.tsx',
  'src/app/(frontend)/blog/category/page.tsx',
  'src/app/(frontend)/blog/category/[categorySlug]/page.tsx',
  'src/app/(frontend)/blog/category/[categorySlug]/page/[pageNumber]/page.tsx',
  'src/app/(frontend)/destinations/page.tsx',
  'src/app/(frontend)/destinations/page/[pageNumber]/page.tsx',
  'src/app/(frontend)/destinations/category/page.tsx',
  'src/app/(frontend)/destinations/category/[categorySlug]/page.tsx',
  'src/app/(frontend)/destinations/category/[categorySlug]/page/[pageNumber]/page.tsx',
  'src/app/(frontend)/tour-packages/page.tsx',
  'src/app/(frontend)/tour-packages/page/[pageNumber]/page.tsx',
  'src/app/(frontend)/tour-packages/category/page.tsx',
  'src/app/(frontend)/tour-packages/category/[categorySlug]/page.tsx',
  'src/app/(frontend)/tour-packages/category/[categorySlug]/page/[pageNumber]/page.tsx',
]

const makeReq = (body: unknown, secret = 'test-secret') =>
  new Request('http://localhost:3000/api/revalidate', {
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      'x-revalidate-secret': secret,
    },
    method: 'POST',
  })

describe('on-demand revalidation', () => {
  afterEach(() => {
    vi.doUnmock('next/cache')
    vi.resetModules()
    delete process.env.REVALIDATE_SECRET
  })

  it('does not leave content routes on 600-second timer ISR', async () => {
    const files = await Promise.all(
      timedRevalidationRoutes.map(async (filePath) => {
        const content = await readFile(path.join(process.cwd(), filePath), 'utf8')
        return [filePath, content] as const
      }),
    )

    expect(
      files.filter(([, content]) => /export const revalidate\s*=\s*600/.test(content)),
    ).toEqual([])
  })

  it('rejects unauthorized webhook revalidation requests', async () => {
    process.env.REVALIDATE_SECRET = 'test-secret'
    const revalidatePath = vi.fn()
    const revalidateTag = vi.fn()

    vi.doMock('next/cache', () => ({
      revalidatePath,
      revalidateTag,
    }))

    const { POST } = await import('../../src/app/(frontend)/api/revalidate/route')
    const res = await POST(makeReq({ slug: 'annapurna-circuit', type: 'blog' }, 'wrong') as never)

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: 'Unauthorized' })
    expect(revalidatePath).not.toHaveBeenCalled()
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('revalidates blog paths and sitemap cache from the webhook endpoint', async () => {
    process.env.REVALIDATE_SECRET = 'test-secret'
    const revalidatePath = vi.fn()
    const revalidateTag = vi.fn()

    vi.doMock('next/cache', () => ({
      revalidatePath,
      revalidateTag,
    }))

    const { POST } = await import('../../src/app/(frontend)/api/revalidate/route')
    const res = await POST(makeReq({ slug: 'annapurna-circuit', type: 'blog' }) as never)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      revalidated: true,
      slug: 'annapurna-circuit',
      type: 'blog',
    })
    expect(revalidatePath).toHaveBeenCalledWith('/blog/annapurna-circuit')
    expect(revalidatePath).toHaveBeenCalledWith('/blog')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/page/[pageNumber]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/category')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/category/[categorySlug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith(
      '/blog/category/[categorySlug]/page/[pageNumber]',
      'page',
    )
    expect(revalidateTag).toHaveBeenCalledWith('blog-sitemap', 'max')
  })

  it('revalidates all dependent archive paths from Payload content hooks', async () => {
    const revalidatePath = vi.fn()
    const revalidateTag = vi.fn()
    const req = {
      context: {},
      payload: {
        logger: {
          info: vi.fn(),
        },
      },
    }

    vi.doMock('next/cache', () => ({
      revalidatePath,
      revalidateTag,
    }))

    const { revalidateBlog } = await import('../../src/collections/Blogs/hooks/revalidateBlog')
    const { revalidateDestination } =
      await import('../../src/collections/Destinations/hooks/revalidateDestination')
    const { revalidateTourPackage } =
      await import('../../src/collections/TourPackages/hooks/revalidateTourPackage')

    await revalidateBlog({
      doc: { _status: 'published', slug: 'everest-base-camp' },
      req,
    } as never)
    await revalidateDestination({
      doc: { _status: 'published', slug: 'pokhara' },
      req,
    } as never)
    await revalidateTourPackage({
      doc: { _status: 'published', availabilityStatus: 'active', slug: 'upper-mustang' },
      req,
    } as never)

    expect(revalidatePath).toHaveBeenCalledWith('/blog/page/[pageNumber]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/category/[categorySlug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith(
      '/blog/category/[categorySlug]/page/[pageNumber]',
      'page',
    )
    expect(revalidatePath).toHaveBeenCalledWith('/destinations/page/[pageNumber]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/destinations/category/[categorySlug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith(
      '/destinations/category/[categorySlug]/page/[pageNumber]',
      'page',
    )
    expect(revalidatePath).toHaveBeenCalledWith('/tour-packages/page/[pageNumber]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/tour-packages/category/[categorySlug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith(
      '/tour-packages/category/[categorySlug]/page/[pageNumber]',
      'page',
    )
  })

  it('revalidates dependent archive and detail patterns from category hooks', async () => {
    const revalidatePath = vi.fn()
    const revalidateTag = vi.fn()
    const req = {
      context: {},
      payload: {
        logger: {
          info: vi.fn(),
        },
      },
    }

    vi.doMock('next/cache', () => ({
      revalidatePath,
      revalidateTag,
    }))

    const { BlogCategories } = await import('../../src/collections/BlogCategories')
    const { DestinationCategories } = await import('../../src/collections/DestinationCategories')
    const { TourPackageCategories } = await import('../../src/collections/TourPackageCategories')

    await BlogCategories.hooks?.afterChange?.[0]?.({
      doc: { slug: 'trekking' },
      req,
    } as never)
    await DestinationCategories.hooks?.afterChange?.[0]?.({
      doc: { slug: 'mountains' },
      req,
    } as never)
    await TourPackageCategories.hooks?.afterChange?.[0]?.({
      doc: { slug: 'expeditions' },
      req,
    } as never)

    expect(revalidatePath).toHaveBeenCalledWith('/blog')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/[slug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/category/[categorySlug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/destinations')
    expect(revalidatePath).toHaveBeenCalledWith('/destinations/[slug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/destinations/category/[categorySlug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/tour-packages')
    expect(revalidatePath).toHaveBeenCalledWith('/tour-packages/[slug]', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/tour-packages/category/[categorySlug]', 'page')
  })
})
