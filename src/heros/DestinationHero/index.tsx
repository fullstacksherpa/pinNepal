import type { Destination, DestinationCategory, District } from '@/payload-types'
import type { LucideIcon } from 'lucide-react'

import { Media } from '@/components/Media'
import { CalendarDays, Clock3, Gauge, MapPin, Mountain } from 'lucide-react'
import Link from 'next/link'
import React, { Fragment } from 'react'

const getDistrictLabel = (district?: number | District | null) => {
  if (!district || typeof district !== 'object') return null

  const province = district.province
  const provinceName = province && typeof province === 'object' ? province.name : null

  return [district.name, provinceName].filter(Boolean).join(', ')
}

export const DestinationHero: React.FC<{
  destination: Destination
}> = ({ destination }) => {
  const {
    altitude,
    bestTimeToVisit,
    categories,
    difficulty,
    district,
    heroImage,
    name,
    recommendedDuration,
    summary,
  } = destination

  const districtLabel = getDistrictLabel(district)

  const facts = [
    districtLabel ? { label: 'Location', value: districtLabel, icon: MapPin } : null,
    recommendedDuration ? { label: 'Trail Time', value: recommendedDuration, icon: Clock3 } : null,
    difficulty ? { label: 'Grade', value: difficulty, icon: Gauge } : null,
    altitude
      ? { label: 'High Point', value: `${altitude.toLocaleString()} m`, icon: Mountain }
      : null,
    bestTimeToVisit && bestTimeToVisit.length > 0
      ? { label: 'Season', value: bestTimeToVisit.join(', '), icon: CalendarDays }
      : null,
  ].filter(Boolean) as {
    label: string
    value: string
    icon: LucideIcon
  }[]

  return (
    <section className="relative -mt-[10.4rem] min-h-[100svh] overflow-hidden bg-[#17251f] text-white">
      {heroImage && typeof heroImage === 'object' && (
        <div className="absolute inset-0">
          <Media fill priority imgClassName="object-cover" resource={heroImage} />
        </div>
      )}

      {/* Soft overlays: readable text but image still visible */}
      <div className="absolute inset-0 bg-linear-to-r from-[#17251f]/86 via-[#17251f]/42 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-[#17251f]/82 via-[#17251f]/20 to-black/25" />

      <div className="container relative z-10 flex min-h-[100svh] items-end pb-8 pt-[15rem] sm:pb-10 sm:pt-[14rem] md:pb-14 md:pt-[15rem] lg:pb-16 lg:pt-[16rem]">
        <div className="w-full">
          <div className="max-w-4xl">
            {categories && categories.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-white/70 sm:mb-5 sm:text-[0.65rem] sm:tracking-[0.28em]">
                {categories.map((category, index) => {
                  if (!category || typeof category !== 'object') return null

                  const typedCategory = category as DestinationCategory
                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={typedCategory.id}>
                      {typedCategory.slug ? (
                        <Link
                          className="transition-colors hover:text-[#f15a24]"
                          href={`/destinations/category/${typedCategory.slug}`}
                        >
                          {typedCategory.title}
                        </Link>
                      ) : (
                        <span>{typedCategory.title}</span>
                      )}

                      {!isLast && <span className="text-[#f15a24]">/</span>}
                    </Fragment>
                  )
                })}
              </div>
            )}

            <p className="mb-3 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#f15a24] sm:mb-4 sm:text-[0.68rem] sm:tracking-[0.32em]">
              PinNepal Destination
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              {name}
            </h1>

            {summary && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:mt-6 sm:text-base sm:leading-7 md:text-lg md:leading-8">
                {summary}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              <Link
                href="/tour-packages"
                className="rounded-full bg-[#f15a24] px-5 py-2.5 font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#17251f] sm:px-6 sm:py-3 sm:text-[0.65rem] sm:tracking-[0.2em]"
              >
                Browse Packages
              </Link>

              <Link
                href="/contact-us"
                className="rounded-full border border-white/35 bg-white/10 px-5 py-2.5 font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-[#17251f] sm:px-6 sm:py-3 sm:text-[0.65rem] sm:tracking-[0.2em]"
              >
                Plan This Trip
              </Link>
            </div>
          </div>

          {facts.length > 0 && (
            <div className="mt-7 max-w-6xl sm:mt-10">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-[#f15a24] sm:w-10" />
                <p className="font-mono text-[0.55rem] font-semibold uppercase tracking-[0.26em] text-white/60 sm:text-[0.6rem] sm:tracking-[0.3em]">
                  Route Markers
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
                {facts.map((fact, index) => {
                  const Icon = fact.icon

                  return (
                    <div
                      className="group relative overflow-hidden border border-white/15 bg-white/[0.07] px-3 py-3 backdrop-blur-[3px] transition hover:border-[#f15a24]/60 hover:bg-white/[0.12] sm:px-4 sm:py-4"
                      key={fact.label}
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-[#f15a24] via-white/30 to-transparent opacity-60" />

                      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4 sm:gap-4">
                        <div className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-[#17251f]/35 sm:size-9">
                          <Icon className="size-3.5 text-white sm:size-4" />
                        </div>

                        <span className="font-mono text-[0.52rem] font-semibold uppercase tracking-[0.18em] text-[#f15a24] sm:text-[0.58rem] sm:tracking-[0.22em]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <p className="font-mono text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[0.56rem] sm:tracking-[0.22em]">
                        {fact.label}
                      </p>

                      <p className="mt-1 text-xs font-semibold leading-4 text-white sm:text-sm sm:leading-5">
                        {fact.value}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
