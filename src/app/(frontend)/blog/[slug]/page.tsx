import type { Metadata } from 'next'

import { RelatedBlogs } from '@/blocks/RelatedBlogs/Component'
import { ArrowLeft, BookOpenText, CalendarDays, Compass, Feather, UserRound } from 'lucide-react'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Button } from '@/components/ui/button'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateTime } from '@/utilities/formatDateTime'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Blog } from '@/payload-types'

import { BlogHero } from '@/heros/BlogHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = blogs.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Blog({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blog/' + decodedSlug
  const blog = await queryBlogBySlug({ slug: decodedSlug })

  if (!blog) return <PayloadRedirects url={url} />

  const categories =
    blog.categories?.filter((category) => typeof category === 'object' && category !== null) || []
  const authors = blog.populatedAuthors || []
  const formattedAuthors = formatAuthors(authors)
  const authorLabel = formattedAuthors || 'PinNepal editorial'
  const introDescription = blog.meta?.description?.replace(/\s/g, ' ')
  const relatedBlogs = blog.relatedBlogs?.filter((blog) => typeof blog === 'object') || []

  return (
    <article className="bg-background pt-16 pb-20">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <BlogHero blog={blog} />

      <div className="border-y border-border bg-card/55">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4 text-sm text-muted-foreground">
          <Link
            className="inline-flex items-center gap-2 font-medium text-foreground hover:text-[#B23A48]"
            href="/blog"
          >
            <ArrowLeft className="size-4" />
            Back to journal
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {blog.publishedAt && (
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 text-[#B23A48]" />
                {formatDateTime(blog.publishedAt)}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <UserRound className="size-4 text-[#B23A48]" />
              {authorLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="container grid gap-12 pt-14 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          <div className="mb-10 border-l-2 border-[#D69E2E] pl-5 md:pl-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B23A48]">
              Field journal
            </p>
            <p className="mt-4 max-w-3xl text-xl leading-8 text-foreground md:text-2xl md:leading-9">
              {introDescription || 'Local travel notes from the PinNepal desk.'}
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-[2rem_minmax(0,1fr)]">
            <div className="relative hidden md:block">
              <div className="sticky top-24 flex flex-col items-center gap-3">
                <span className="size-3 rounded-full bg-[#B23A48]" />
                <span className="h-72 w-px bg-linear-to-b from-[#B23A48] via-[#D69E2E] to-transparent" />
              </div>
            </div>
            <RichText
              className="mx-auto max-w-[46rem] text-[1.03rem] leading-8 prose-headings:font-semibold prose-headings:tracking-normal prose-h2:mt-14 prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h2:text-3xl prose-h3:mt-10 prose-h3:text-2xl prose-p:my-6 prose-p:leading-8 prose-a:font-medium prose-a:text-[#B23A48] prose-blockquote:border-l-[#D69E2E] prose-blockquote:bg-card/70 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-img:rounded-lg prose-hr:my-12"
              data={blog.content}
              enableGutter={false}
            />
          </div>

          {relatedBlogs.length > 0 && (
            <section className="mt-16 border-t border-border pt-12">
              <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B23A48]">
                    Keep reading
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">Related travel notes</h2>
                </div>
                <Button asChild variant="outline">
                  <Link href="/blog">View all blogs</Link>
                </Button>
              </div>
              <div className="-mx-4 md:mx-0">
                <RelatedBlogs className="px-4 lg:px-0" docs={relatedBlogs} />
              </div>
            </section>
          )}
        </div>

        <aside className="lg:pt-1">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-[#B23A48]/10 text-[#B23A48]">
                  <BookOpenText className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Article notes</p>
                  <p className="text-xs text-muted-foreground">For planning and discovery</p>
                </div>
              </div>
              <dl className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <UserRound className="mt-0.5 size-4 shrink-0 text-[#B23A48]" />
                  <div>
                    <dt className="font-medium">Written by</dt>
                    <dd className="mt-1 text-muted-foreground">{authorLabel}</dd>
                  </div>
                </div>
                {blog.publishedAt && (
                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#B23A48]" />
                    <div>
                      <dt className="font-medium">Published</dt>
                      <dd className="mt-1 text-muted-foreground">
                        {formatDateTime(blog.publishedAt)}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            {categories.length > 0 && (
              <div className="rounded-lg border border-border bg-background p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Compass className="size-4 text-[#D69E2E]" />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
                    Explore by topic
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const titleToUse = category.title || 'Untitled category'

                    return category.slug ? (
                      <Link
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-[#B23A48] hover:text-[#B23A48]"
                        href={`/blog/category/${category.slug}`}
                        key={category.id}
                      >
                        {titleToUse}
                      </Link>
                    ) : (
                      <span
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
                        key={category.id}
                      >
                        {titleToUse}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-[#D69E2E]/40 bg-[#D69E2E]/10 p-5">
              <Feather className="mb-4 size-5 text-[#B23A48]" />
              <p className="text-sm font-medium leading-6">
                Save this note while comparing destinations, short hikes, and longer Nepal travel
                routes.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const blog = await queryBlogBySlug({ slug: decodedSlug })

  return generateMeta({ doc: blog })
}

const queryBlogBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'blogs',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
