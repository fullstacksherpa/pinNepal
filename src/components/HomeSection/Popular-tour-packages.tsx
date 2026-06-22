import configPromise from '@payload-config'
import { ArrowRight, CalendarDays, Compass, MapPin, Mountain, Route, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload, type Where } from 'payload'

type UnknownRecord = Record<string, unknown>

type PopularTourPackage = {
  id: string | number
  availabilityStatus?: string | null
  coverImage?: unknown
  currency?: string | null
  difficultyLevel?: unknown
  endLocation?: unknown
  pricePerPerson?: number | null
  rating?: number | null
  region?: unknown
  reviewCount?: number | null
  slug?: string | null
  startLocation?: unknown
  tagline?: string | null
  title?: string | null
  totalDays?: number | null
  totalNights?: number | null
}

const TOUR_PACKAGE_LIMIT = 7

const publicTourPackageWhere: Where = {
  and: [
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
  ],
}

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

function getCoverImage(image: unknown, fallbackAlt: string) {
  if (!isRecord(image)) return null

  const url = text(image.url)
  const alt = text(image.alt) || fallbackAlt

  if (!url) return null

  return {
    url,
    alt,
  }
}

function getPackageHref(tourPackage: PopularTourPackage) {
  return tourPackage.slug ? `/tour-packages/${tourPackage.slug}` : '/tour-packages'
}

function formatDuration(days?: number | null, nights?: number | null) {
  if (days && nights) return `${days}D / ${nights}N`
  if (days) return `${days} Days`
  if (nights) return `${nights} Nights`
  return 'Multi-day'
}

function formatPrice(currency?: string | null, price?: number | null) {
  if (!price) return 'Custom quote'

  const safeCurrency = currency || 'USD'

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `${safeCurrency} ${price.toLocaleString()}`
  }
}

function PackageImage({ tourPackage, index }: { tourPackage: PopularTourPackage; index: number }) {
  const title = text(tourPackage.title) || 'Nepal tour package'
  const coverImage = getCoverImage(tourPackage.coverImage, title)
  const duration = formatDuration(tourPackage.totalDays, tourPackage.totalNights)

  if (coverImage) {
    return (
      <div className="relative h-56 overflow-hidden bg-[var(--pn-green)]">
        <Image
          src={coverImage.url}
          alt={coverImage.alt}
          fill
          sizes="(min-width: 1024px) 390px, (min-width: 640px) 360px, 82vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pn-navy)]/65 via-[var(--pn-navy)]/10 to-transparent" />

        <div className="absolute left-3 top-3 rounded-none bg-white/90 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--pn-navy)]">
          0{index + 1}
        </div>

        <div className="absolute bottom-3 right-3 rounded-none bg-[var(--pn-orange)] px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white">
          {duration}
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
        Guided Nepal
      </div>

      <div className="absolute left-3 top-3 rounded-none bg-white/90 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--pn-navy)]">
        0{index + 1}
      </div>

      <div className="absolute bottom-3 right-3 rounded-none bg-[var(--pn-orange)] px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white">
        {duration}
      </div>
    </div>
  )
}

function TourPackageCard({
  tourPackage,
  index,
}: {
  tourPackage: PopularTourPackage
  index: number
}) {
  const title = text(tourPackage.title) || 'Untitled package'
  const tagline =
    text(tourPackage.tagline) ||
    'A guided journey across Nepal with route planning, local insight, and flexible support.'

  const region = labelFrom(tourPackage.region)
  const startLocation = labelFrom(tourPackage.startLocation)
  const endLocation = labelFrom(tourPackage.endLocation)
  const difficulty = labelFrom(tourPackage.difficultyLevel)

  const routeLabel =
    startLocation && endLocation
      ? `${startLocation} to ${endLocation}`
      : region || startLocation || 'Nepal route'

  const price = formatPrice(tourPackage.currency, tourPackage.pricePerPerson)
  const duration = formatDuration(tourPackage.totalDays, tourPackage.totalNights)

  return (
    <Link
      href={getPackageHref(tourPackage)}
      className="group flex min-w-[82vw] max-w-[82vw] snap-start flex-col overflow-hidden border border-[#ded8c8] bg-white/60 transition duration-300 hover:-translate-y-1 hover:border-[var(--pn-green)] sm:min-w-[360px] sm:max-w-[360px] lg:min-w-[390px] lg:max-w-[390px]"
    >
      <PackageImage tourPackage={tourPackage} index={index} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-[var(--pn-mist)]">
            Guided package
          </p>

          {tourPackage.rating ? (
            <span className="flex items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--pn-orange)]">
              <Star className="h-3.5 w-3.5 fill-current" />
              {tourPackage.rating}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-[var(--pn-navy)]">
          {title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--pn-navy)]/80">{tagline}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#ded8c8] pt-4">
          <div>
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[var(--pn-mist)]">
              From
            </p>
            <p className="mt-1 font-serif text-xl font-bold text-[var(--pn-navy)]">{price}</p>
          </div>

          <div>
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[var(--pn-mist)]">
              Duration
            </p>
            <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--pn-navy)]">
              {duration}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#ded8c8] pt-4">
          <span className="flex min-w-0 items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[var(--pn-mist)]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{routeLabel}</span>
          </span>

          <span className="flex shrink-0 items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--pn-orange)]">
            View
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </span>
        </div>

        {difficulty ? (
          <div className="mt-3 flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-[var(--pn-navy)]/55">
            <Route className="h-3.5 w-3.5" />
            {difficulty}
          </div>
        ) : null}
      </div>
    </Link>
  )
}

function ExploreAllTourPackagesCard() {
  return (
    <Link
      href="/tour-packages"
      className="group relative flex min-w-[82vw] max-w-[82vw] snap-start flex-col justify-between overflow-hidden border border-[var(--pn-navy)] bg-[var(--pn-navy)] p-6 text-white transition duration-300 hover:-translate-y-1 sm:min-w-[360px] sm:max-w-[360px] lg:min-w-[390px] lg:max-w-[390px]"
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
          More journeys
        </p>

        <h3 className="mt-3 font-serif text-3xl font-bold leading-tight">
          Explore all tour packages
        </h3>

        <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">
          Compare treks, cultural circuits, wildlife trips, private adventures, and remote valley
          routes across Nepal.
        </p>
      </div>

      <div className="relative z-10 mt-14 flex items-center justify-between border-t border-white/20 pt-4">
        <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/70">
          <CalendarDays className="h-3.5 w-3.5" />
          All packages
        </span>

        <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export async function PopularTourPackages() {
  const payload = await getPayload({ config: configPromise })

  const tourPackages = await payload.find({
    collection: 'tour-packages',
    depth: 2,
    limit: TOUR_PACKAGE_LIMIT,
    sort: '-createdAt',
    overrideAccess: false,
    select: {
      id: true,
      availabilityStatus: true,
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
    },
    where: publicTourPackageWhere,
  })

  const packageDocs = tourPackages.docs as PopularTourPackage[]

  if (packageDocs.length === 0) return null

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 border-t border-[#ded8c8] pt-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--pn-mist)]">
              Curated tour packages
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--pn-navy)] md:text-5xl">
              Guided journeys built for Nepal.
            </h2>

            <p className="mt-4 text-base leading-7 text-[var(--pn-navy)]/75">
              Swipe through handpicked treks, cultural routes, and private adventures designed
              around trails, villages, and mountain days.
            </p>
          </div>

          <Link
            href="/tour-packages"
            className="hidden items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--pn-orange)] transition hover:text-[var(--pn-navy)] md:flex"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-4">
            {packageDocs.map((tourPackage, index) => (
              <TourPackageCard key={tourPackage.id} tourPackage={tourPackage} index={index} />
            ))}

            <ExploreAllTourPackagesCard />
          </div>
        </div>
      </div>
    </section>
  )
}
