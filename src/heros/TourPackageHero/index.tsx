import type { TourPackage, TourPackageCategory } from '@/payload-types'

import {
  ArrowDown,
  CalendarDays,
  MapPin,
  MessageCircle,
  Mountain,
  Route,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Media } from '@/components/Media'
import React from 'react'
import {
  formatCurrency,
  formatDifficulty,
  getRegionLabel,
  getWhatsAppHref,
} from '@/utilities/tourPackages'

type HeroFact = {
  icon: LucideIcon
  label: string
  value: string
}

export const TourPackageHero: React.FC<{
  tourPackage: TourPackage
}> = ({ tourPackage }) => {
  const {
    averageGroupSize,
    categories,
    coverImage,
    currency,
    difficultyLabel,
    difficultyLevel,
    endLocation,
    maxGroupSize,
    pricePerPerson,
    rating,
    region,
    reviewCount,
    startLocation,
    tagline,
    title,
    totalDays,
    totalNights,
    whatsappNumber,
    whatsappPrefillMessage,
  } = tourPackage

  const durationLabel = totalDays
    ? `${totalDays} day${totalDays === 1 ? '' : 's'}${
        totalNights ? ` / ${totalNights} night${totalNights === 1 ? '' : 's'}` : ''
      }`
    : null

  const compactDurationLabel = totalDays
    ? `${totalDays}D${totalNights ? ` / ${totalNights}N` : ''}`
    : null

  const difficulty = difficultyLabel || formatDifficulty(difficultyLevel)

  const groupSize = averageGroupSize
    ? `${averageGroupSize} people average`
    : maxGroupSize
      ? `Up to ${maxGroupSize} people`
      : null

  const routeLabel =
    startLocation && endLocation
      ? `${startLocation} to ${endLocation}`
      : startLocation || endLocation || null

  const price = formatCurrency(pricePerPerson, currency || 'NPR')
  const regionLabel = getRegionLabel(region)

  const whatsappHref = getWhatsAppHref({
    message: whatsappPrefillMessage,
    number: whatsappNumber,
    title,
  })

  const facts = [
    routeLabel ? { icon: Route, label: 'Route', value: routeLabel } : null,
    durationLabel ? { icon: CalendarDays, label: 'Duration', value: durationLabel } : null,
    difficulty ? { icon: Mountain, label: 'Difficulty', value: difficulty } : null,
    groupSize ? { icon: Users, label: 'Group size', value: groupSize } : null,
  ].filter(Boolean) as HeroFact[]

  const hasCategories = Array.isArray(categories) && categories.length > 0

  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden bg-[var(--pn-navy)] text-white">
      {coverImage && typeof coverImage === 'object' ? (
        <Media fill priority imgClassName="-z-20 object-cover" resource={coverImage} />
      ) : (
        <div className="absolute inset-0 -z-20 bg-[var(--pn-green)]" />
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--pn-navy)] via-[var(--pn-navy)]/72 to-[var(--pn-navy)]/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-40 w-full bg-white/10"
        style={{
          clipPath:
            'polygon(0 100%, 12% 58%, 24% 74%, 39% 34%, 52% 70%, 66% 40%, 82% 78%, 100% 48%, 100% 100%)',
        }}
      />

      <div className="container relative z-10 flex min-h-[92svh] items-end pb-10 pt-20 md:pt-23 lg:pb-14">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div className="max-w-5xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Link
                href="/tour-packages"
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/80 backdrop-blur-md transition hover:bg-white/15"
              >
                Tour packages
              </Link>

              {regionLabel && (
                <span className="rounded-full border border-white/20 bg-black/20 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/70 backdrop-blur-md">
                  {regionLabel}
                </span>
              )}

              {compactDurationLabel && (
                <span className="rounded-full bg-[var(--pn-orange)] px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white">
                  {compactDurationLabel}
                </span>
              )}
            </div>

            {hasCategories && (
              <div className="mb-5 flex flex-wrap gap-2">
                {categories.map((category) => {
                  if (!category || typeof category !== 'object') return null

                  const typedCategory = category as TourPackageCategory

                  if (!typedCategory.title) return null

                  return typedCategory.slug ? (
                    <Link
                      className="border border-white/20 bg-white/10 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                      href={`/tour-packages/category/${typedCategory.slug}`}
                      key={typedCategory.id}
                    >
                      {typedCategory.title}
                    </Link>
                  ) : (
                    <span
                      className="border border-white/20 bg-white/10 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md"
                      key={typedCategory.id}
                    >
                      {typedCategory.title}
                    </span>
                  )
                })}
              </div>
            )}

            <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-white/60">
              Guided journey across Nepal
            </p>

            <h1 className="mt-4 max-w-5xl font-serif text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
              {title}
            </h1>

            {tagline && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/82 md:text-lg">
                {tagline}
              </p>
            )}

            <div className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {facts.map((fact) => {
                const Icon = fact.icon

                return (
                  <div
                    className="border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                    key={fact.label}
                  >
                    <p className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/55">
                      <Icon className="size-4" />
                      {fact.label}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white">{fact.value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <aside
            className="border border-white/20 bg-[var(--pn-navy)]/72 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-6"
            id="booking"
          >
            <div className="flex items-start justify-between gap-5 border-b border-white/15 pb-5">
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/50">
                  Starting from
                </p>

                <p className="mt-2 font-serif text-4xl font-bold leading-none text-white">
                  {price || 'Inquire'}
                </p>

                <p className="mt-2 text-sm text-white/60">per person</p>
              </div>

              {typeof rating === 'number' && (
                <div className="shrink-0 border border-white/15 bg-white/10 px-3 py-2 text-right">
                  <p className="flex items-center justify-end gap-1 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white">
                    <Star className="size-4 fill-[var(--pn-orange)] text-[var(--pn-orange)]" />
                    {rating.toFixed(1)}
                  </p>

                  {reviewCount ? (
                    <p className="mt-1 text-xs text-white/55">{reviewCount} reviews</p>
                  ) : (
                    <p className="mt-1 text-xs text-white/55">Rated trip</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 border-b border-white/15 py-5">
              {durationLabel && (
                <div>
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.22em] text-white/45">
                    Duration
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{durationLabel}</p>
                </div>
              )}

              {difficulty && (
                <div>
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.22em] text-white/45">
                    Difficulty
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{difficulty}</p>
                </div>
              )}

              {groupSize && (
                <div>
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.22em] text-white/45">
                    Group
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{groupSize}</p>
                </div>
              )}

              {regionLabel && (
                <div>
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.22em] text-white/45">
                    Region
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{regionLabel}</p>
                </div>
              )}
            </div>

            {routeLabel && (
              <div className="border-b border-white/15 py-5">
                <p className="flex items-center gap-2 font-mono text-[0.54rem] uppercase tracking-[0.22em] text-white/45">
                  <MapPin className="size-4" />
                  Route
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-white">{routeLabel}</p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3">
              {whatsappHref ? (
                <Button
                  asChild
                  className="h-12 rounded-full bg-[var(--pn-orange)] font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white hover:bg-[var(--pn-orange)]/90"
                  size="lg"
                >
                  <Link href={whatsappHref} target="_blank">
                    <MessageCircle className="size-4" />
                    Chat to book
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="h-12 rounded-full bg-[var(--pn-orange)] font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white hover:bg-[var(--pn-orange)]/90"
                  size="lg"
                >
                  <a href="#booking-form">
                    <MessageCircle className="size-4" />
                    Inquire now
                  </a>
                </Button>
              )}

              <Button
                asChild
                className="h-12 rounded-full border-white/35 bg-white/5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white hover:bg-white/10"
                size="lg"
                variant="outline"
              >
                <a href="#itinerary">
                  <ArrowDown className="size-4" />
                  View itinerary
                </a>
              </Button>
            </div>

            <div className="mt-5 flex items-start gap-3 border-t border-white/15 pt-5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--pn-orange)]" />
              <p className="text-xs leading-5 text-white/58">
                Local planning support, route context, and flexible booking help from PinNepal.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
