import configPromise from '@payload-config'
import { ArrowRight, BookOpen, Compass, Feather, MapPin, Mountain } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

type UnknownRecord = Record<string, unknown>

type PopularBlog = {
  id: string | number
  title?: string | null
  authors?: unknown
  slug?: string | null
  categories?: unknown
  meta?: unknown
  populatedAuthors?: unknown
  heroImage?: unknown
}

const BLOG_LIMIT = 7

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function text(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number') return String(value)
  return null
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function labelFrom(value: unknown): string | null {
  const direct = text(value)
  if (direct) return formatLabel(direct)

  if (!isRecord(value)) return null

  const keys = ['name', 'title', 'label', 'value', 'slug']

  for (const key of keys) {
    const label = text(value[key])
    if (label) return formatLabel(label)
  }

  return null
}

function firstCategoryLabel(categories: unknown): string | null {
  if (!Array.isArray(categories) || categories.length === 0) return null
  return labelFrom(categories[0])
}

function firstAuthorLabel(authors: unknown): string | null {
  if (!Array.isArray(authors) || authors.length === 0) return null

  const firstAuthor = authors[0]

  if (typeof firstAuthor === 'string') return firstAuthor

  if (isRecord(firstAuthor)) {
    return (
      text(firstAuthor.name) ||
      text(firstAuthor.title) ||
      text(firstAuthor.email) ||
      text(firstAuthor.username)
    )
  }

  return null
}

function getImage(image: unknown, fallbackAlt: string) {
  if (!isRecord(image)) return null

  const url = text(image.url)
  const alt = text(image.alt) || fallbackAlt

  if (!url) return null

  return {
    url,
    alt,
  }
}

function getBlogImage(blog: PopularBlog, fallbackAlt: string) {
  const heroImage = getImage(blog.heroImage, fallbackAlt)

  if (heroImage) return heroImage

  if (isRecord(blog.meta)) {
    const metaImage = getImage(blog.meta.image, fallbackAlt)
    if (metaImage) return metaImage
  }

  return null
}

function getMetaDescription(meta: unknown): string | null {
  if (!isRecord(meta)) return null

  return text(meta.description)
}

function getBlogHref(blog: PopularBlog) {
  return blog.slug ? `/${blog.slug}` : '/blog'
}

function BlogImage({ blog, index }: { blog: PopularBlog; index: number }) {
  const title = text(blog.title) || 'PinNepal story'
  const image = getBlogImage(blog, title)

  if (image) {
    return (
      <div className="relative h-56 overflow-hidden bg-[var(--pn-green)]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 390px, (min-width: 640px) 360px, 82vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pn-navy)]/65 via-[var(--pn-navy)]/10 to-transparent" />

        <div className="absolute left-3 top-3 rounded-none bg-white/90 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--pn-navy)]">
          0{index + 1}
        </div>

        <div className="absolute bottom-3 right-3 rounded-none bg-[var(--pn-orange)] px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white">
          Story
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-56 overflow-hidden bg-[var(--pn-green)]">
      <div
        className="absolute bottom-0 left-0 h-28 w-full bg-white/15"
        style={{
          clipPath: 'polygon(0 100%, 14% 48%, 29% 70%, 46% 18%, 61% 55%, 76% 30%, 100% 100%)',
        }}
      />

      <div className="absolute left-5 top-5 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/75">
        <Mountain className="h-3.5 w-3.5" />
        Field notes
      </div>

      <div className="absolute left-3 top-3 rounded-none bg-white/90 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--pn-navy)]">
        0{index + 1}
      </div>

      <div className="absolute bottom-3 right-3 rounded-none bg-[var(--pn-orange)] px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white">
        Story
      </div>
    </div>
  )
}

function BlogCard({ blog, index }: { blog: PopularBlog; index: number }) {
  const title = text(blog.title) || 'Untitled story'
  const category = firstCategoryLabel(blog.categories)
  const author = firstAuthorLabel(blog.populatedAuthors) || firstAuthorLabel(blog.authors)

  const description =
    getMetaDescription(blog.meta) ||
    'Read practical notes on routes, permits, weather windows, local travel days, and exploring Nepal with better context.'

  return (
    <Link
      href={getBlogHref(blog)}
      className="group flex min-w-[82vw] max-w-[82vw] snap-start flex-col overflow-hidden border border-[#ded8c8] bg-white/60 transition duration-300 hover:-translate-y-1 hover:border-[var(--pn-green)] sm:min-w-[360px] sm:max-w-[360px] lg:min-w-[390px] lg:max-w-[390px]"
    >
      <BlogImage blog={blog} index={index} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-[var(--pn-mist)]">
            {category || 'Field note'}
          </p>

          <span className="flex items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--pn-orange)]">
            <Feather className="h-3.5 w-3.5" />
            Read
          </span>
        </div>

        <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-[var(--pn-navy)]">
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--pn-navy)]/80">
          {description}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-[#ded8c8] pt-4">
            <span className="flex min-w-0 items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[var(--pn-mist)]">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{author ? `By ${author}` : 'PinNepal Journal'}</span>
            </span>

            <span className="flex shrink-0 items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--pn-orange)]">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ExploreAllBlogsCard() {
  return (
    <Link
      href="/blog"
      className="group relative flex min-w-[82vw] max-w-[82vw] snap-start flex-col justify-between overflow-hidden border border-[var(--pn-green)] bg-[var(--pn-green)] p-6 text-white transition duration-300 hover:-translate-y-1 sm:min-w-[360px] sm:max-w-[360px] lg:min-w-[390px] lg:max-w-[390px]"
    >
      <div
        className="absolute bottom-0 left-0 h-36 w-full bg-white/10"
        style={{
          clipPath: 'polygon(0 100%, 16% 52%, 34% 75%, 52% 20%, 68% 58%, 84% 35%, 100% 100%)',
        }}
      />

      <div className="relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <Compass className="h-5 w-5" />
        </div>

        <p className="mt-8 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-white/65">
          Journal archive
        </p>

        <h3 className="mt-3 font-serif text-3xl font-bold leading-tight">Explore all stories</h3>

        <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">
          Read route guides, travel notes, permit tips, weather windows, and practical stories from
          across Nepal.
        </p>
      </div>

      <div className="relative z-10 mt-14 flex items-center justify-between border-t border-white/20 pt-4">
        <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/70">
          <MapPin className="h-3.5 w-3.5" />
          All stories
        </span>

        <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export async function PopularBlogs() {
  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'blogs',
    depth: 1,
    limit: BLOG_LIMIT,
    sort: '-createdAt',
    overrideAccess: false,
    select: {
      id: true,
      title: true,
      authors: true,
      slug: true,
      categories: true,
      meta: true,
      populatedAuthors: true,
      heroImage: true,
    },
  })

  const blogDocs = blogs.docs as PopularBlog[]

  if (blogDocs.length === 0) return null

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 border-t border-[#ded8c8] pt-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--pn-mist)]">
              Field notes and route guides
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--pn-navy)] md:text-5xl">
              Stories from the trail.
            </h2>

            <p className="mt-4 text-base leading-7 text-[var(--pn-navy)]/75">
              Swipe through practical notes on routes, permits, weather windows, villages, and
              travel days across Nepal.
            </p>
          </div>

          <Link
            href="/blog"
            className="hidden items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--pn-orange)] transition hover:text-[var(--pn-navy)] md:flex"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-4">
            {blogDocs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}

            <ExploreAllBlogsCard />
          </div>
        </div>
      </div>
    </section>
  )
}
