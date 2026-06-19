import type { TourPackage, TourPackageCategory } from '@/payload-types'

import { CalendarDays, MapPin, MessageCircle, Mountain, Star, Users } from 'lucide-react'
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
    ? `${totalDays} day${totalDays === 1 ? '' : 's'}${totalNights ? ` / ${totalNights} nights` : ''}`
    : null
  const difficulty = difficultyLabel || formatDifficulty(difficultyLevel)
  const groupSize = averageGroupSize
    ? `${averageGroupSize} people average`
    : maxGroupSize
      ? `Up to ${maxGroupSize} people`
      : null
  const price = formatCurrency(pricePerPerson, currency || 'NPR')
  const regionLabel = getRegionLabel(region)
  const whatsappHref = getWhatsAppHref({
    message: whatsappPrefillMessage,
    number: whatsappNumber,
    title,
  })

  const facts = [
    startLocation && endLocation
      ? { icon: MapPin, label: 'Route', value: `${startLocation} to ${endLocation}` }
      : null,
    durationLabel ? { icon: CalendarDays, label: 'Duration', value: durationLabel } : null,
    difficulty ? { icon: Mountain, label: 'Difficulty', value: difficulty } : null,
    groupSize ? { icon: Users, label: 'Group size', value: groupSize } : null,
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[]

  return (
    <section className="relative -mt-[10.4rem] min-h-[86vh] overflow-hidden bg-black text-white">
      {coverImage && typeof coverImage === 'object' && (
        <Media fill priority imgClassName="-z-10 object-cover" resource={coverImage} />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-black/10" />

      <div className="container relative z-10 flex min-h-[86vh] items-end pb-10 pt-40">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-4xl">
            {categories && categories.length > 0 && (
              <div className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-white/75">
                {categories.map((category, index) => {
                  if (!category || typeof category !== 'object') return null

                  const typedCategory = category as TourPackageCategory
                  const isLast = index === categories.length - 1

                  return (
                    <React.Fragment key={typedCategory.id}>
                      {typedCategory.slug ? (
                        <Link
                          className="hover:underline"
                          href={`/tour-packages/category/${typedCategory.slug}`}
                        >
                          {typedCategory.title}
                        </Link>
                      ) : (
                        typedCategory.title
                      )}
                      {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                    </React.Fragment>
                  )
                })}
              </div>
            )}

            <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{title}</h1>
            {tagline && <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">{tagline}</p>}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => {
                const Icon = fact.icon

                return (
                  <div className="border-t border-white/25 pt-3" key={fact.label}>
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
                      <Icon className="size-4" />
                      {fact.label}
                    </p>
                    <p className="mt-2 text-base font-medium">{fact.value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <aside
            className="rounded-lg border border-white/20 bg-black/55 p-5 backdrop-blur-md"
            id="booking"
          >
            {typeof rating === 'number' && (
              <p className="mb-4 flex items-center gap-2 text-sm font-medium text-white/85">
                <Star className="size-4 fill-[#D69E2E] text-[#D69E2E]" />
                {rating.toFixed(1)}/5
                {reviewCount ? (
                  <span className="text-white/60">({reviewCount} reviews)</span>
                ) : null}
              </p>
            )}
            {regionLabel && <p className="text-sm text-white/70">{regionLabel}</p>}
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/60">From</p>
            <p className="mt-1 text-3xl font-semibold">{price || 'Inquire'}</p>
            <p className="mt-1 text-sm text-white/65">per person</p>

            <div className="mt-6 flex flex-col gap-3">
              {whatsappHref ? (
                <Button asChild className="bg-[#B23A48] text-white hover:bg-[#9c2f3e]" size="lg">
                  <Link href={whatsappHref} target="_blank">
                    <MessageCircle className="size-4" />
                    Chat to book
                  </Link>
                </Button>
              ) : (
                <Button asChild className="bg-[#B23A48] text-white hover:bg-[#9c2f3e]" size="lg">
                  <a href="#booking">Inquire now</a>
                </Button>
              )}
              <Button
                asChild
                className="border-white/70 text-white hover:bg-white/10"
                size="lg"
                variant="outline"
              >
                <a href="#itinerary">View itinerary</a>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
