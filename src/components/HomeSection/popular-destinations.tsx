import configPromise from '@payload-config'
import { ArrowRight, Compass, MapPin, Mountain, Route } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

type UnknownRecord = Record<string, unknown>

type PopularDestination = {
  id: string | number
  bestTimeToVisit?: string | null
  categories?: unknown
  difficulty?: unknown
  district?: unknown
  heroImage?: unknown
  name?: string | null
  recommendedDuration?: string | null
  slug?: string | null
  summary?: string | null
}

const MAX_HOME_CARDS = 8
const DESTINATION_LIMIT = MAX_HOME_CARDS - 1

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

function getHeroImage(image: unknown, fallbackAlt: string) {
  if (!isRecord(image)) return null

  const url = text(image.url)
  const alt = text(image.alt) || fallbackAlt

  if (!url) return null

  return {
    url,
    alt,
  }
}

function getDestinationHref(destination: PopularDestination) {
  return destination.slug ? `/destinations/${destination.slug}` : '/destinations'
}

function DestinationImage({
  destination,
  index,
}: {
  destination: PopularDestination
  index: number
}) {
  const name = text(destination.name) || 'Nepal destination'
  const heroImage = getHeroImage(destination.heroImage, name)

  if (heroImage) {
    return (
      <div className="relative h-56 overflow-hidden bg-[var(--pn-green)]">
        <Image
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          sizes="(min-width: 1024px) 390px, (min-width: 640px) 360px, 82vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pn-navy)]/55 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 rounded-none bg-[var(--pn-navy)]/85 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white">
          0{index + 1}
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-56 overflow-hidden bg-[var(--pn-green)]">
      <div
        className="absolute bottom-0 left-0 h-28 w-full bg-white/15"
        style={{
          clipPath: 'polygon(0 100%, 14% 46%, 30% 70%, 48% 16%, 62% 58%, 76% 32%, 100% 100%)',
        }}
      />

      <div className="absolute left-5 top-5 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/75">
        <Mountain className="h-3.5 w-3.5" />
        Nepal
      </div>

      <div className="absolute bottom-3 left-3 rounded-none bg-[var(--pn-navy)]/85 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white">
        0{index + 1}
      </div>
    </div>
  )
}

function DestinationCard({
  destination,
  index,
}: {
  destination: PopularDestination
  index: number
}) {
  const name = text(destination.name) || 'Untitled destination'
  const summary =
    text(destination.summary) ||
    'Explore trails, mountain views, local culture, and practical route notes for this destination.'

  const category = firstCategoryLabel(destination.categories)
  const district = labelFrom(destination.district)
  const difficulty = labelFrom(destination.difficulty)
  const duration = text(destination.recommendedDuration)
  const bestTime = text(destination.bestTimeToVisit)

  const eyebrow = [category, district].filter(Boolean).join(' / ') || 'Nepal destination'
  const meta = duration || difficulty || bestTime || 'Route guide'

  return (
    <Link
      href={getDestinationHref(destination)}
      className="group flex min-w-[82vw] max-w-[82vw] snap-start flex-col overflow-hidden border border-[#ded8c8] bg-white/60 transition duration-300 hover:-translate-y-1 hover:border-[var(--pn-green)] sm:min-w-[360px] sm:max-w-[360px] lg:min-w-[390px] lg:max-w-[390px]"
    >
      <DestinationImage destination={destination} index={index} />

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.26em] text-[var(--pn-mist)]">
          {eyebrow}
        </p>

        <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-[var(--pn-navy)]">
          {name}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--pn-navy)]/80">{summary}</p>

        <div className="mt-5 flex items-center justify-between border-t border-[#ded8c8] pt-4">
          <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--pn-mist)]">
            <Route className="h-3.5 w-3.5" />
            {meta}
          </span>

          <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--pn-orange)]">
            View
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function ExploreAllCard() {
  return (
    <Link
      href="/destinations"
      className="group relative flex min-w-[82vw] max-w-[82vw] snap-start flex-col justify-between overflow-hidden border border-[var(--pn-green)] bg-[var(--pn-green)] p-6 text-white transition duration-300 hover:-translate-y-1 sm:min-w-[360px] sm:max-w-[360px] lg:min-w-[390px] lg:max-w-[390px]"
    >
      <div
        className="absolute bottom-0 left-0 h-36 w-full bg-white/10"
        style={{
          clipPath: 'polygon(0 100%, 18% 48%, 33% 72%, 52% 18%, 68% 56%, 82% 32%, 100% 100%)',
        }}
      />

      <div className="relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <Compass className="h-5 w-5" />
        </div>

        <p className="mt-8 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-white/65">
          Full archive
        </p>

        <h3 className="mt-3 font-serif text-3xl font-bold leading-tight">
          Explore all destinations
        </h3>

        <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">
          Browse every destination across Nepal by district, route style, difficulty, and travel
          season.
        </p>
      </div>

      <div className="relative z-10 mt-14 flex items-center justify-between border-t border-white/20 pt-4">
        <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/70">
          <MapPin className="h-3.5 w-3.5" />
          Destinations
        </span>

        <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export async function PopularDestinations() {
  const payload = await getPayload({ config: configPromise })

  const destinations = await payload.find({
    collection: 'destinations',
    depth: 2,
    limit: DESTINATION_LIMIT,
    sort: '-createdAt',
    overrideAccess: false,
    select: {
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
    },
  })

  const destinationDocs = destinations.docs as PopularDestination[]

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 border-t border-[#ded8c8] pt-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--pn-mist)]">
              Popular destinations
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--pn-navy)] md:text-5xl">
              Start with Nepal’s most loved places.
            </h2>

            <p className="mt-4 text-base leading-7 text-[var(--pn-navy)]/75">
              Swipe through selected destinations, from classic routes to remote places worth
              planning around.
            </p>
          </div>

          <Link
            href="/destinations"
            className="hidden items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--pn-orange)] transition hover:text-[var(--pn-navy)] md:flex"
          >
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-4">
            {destinationDocs.map((destination, index) => (
              <DestinationCard key={destination.id} destination={destination} index={index} />
            ))}

            <ExploreAllCard />
          </div>
        </div>
      </div>
    </section>
  )
}
