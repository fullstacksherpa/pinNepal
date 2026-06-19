import type { Destination, DestinationCategory, District } from '@/payload-types'

import { Media } from '@/components/Media'
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
    districtLabel ? { label: 'Location', value: districtLabel } : null,
    recommendedDuration ? { label: 'Duration', value: recommendedDuration } : null,
    difficulty ? { label: 'Difficulty', value: difficulty } : null,
    altitude ? { label: 'Highest elevation', value: `${altitude.toLocaleString()} m` } : null,
    bestTimeToVisit && bestTimeToVisit.length > 0
      ? { label: 'Best time', value: bestTimeToVisit.join(', ') }
      : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <section className="relative -mt-[10.4rem] flex min-h-[80vh] items-end overflow-hidden bg-black text-white">
      {heroImage && typeof heroImage === 'object' && (
        <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10" />

      <div className="container relative z-10 pb-10 pt-40 lg:grid lg:grid-cols-[1fr_52rem_1fr]">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          {categories && categories.length > 0 && (
            <div className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-white/75">
              {categories.map((category, index) => {
                if (!category || typeof category !== 'object') return null

                const typedCategory = category as DestinationCategory
                const isLast = index === categories.length - 1

                return (
                  <Fragment key={typedCategory.id}>
                    {typedCategory.slug ? (
                      <Link
                        className="hover:underline"
                        href={`/destinations/category/${typedCategory.slug}`}
                      >
                        {typedCategory.title}
                      </Link>
                    ) : (
                      typedCategory.title
                    )}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              })}
            </div>
          )}

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">{summary}</p>

          {facts.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((fact) => (
                <div className="border-t border-white/25 pt-3" key={fact.label}>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">{fact.label}</p>
                  <p className="mt-2 text-base font-medium">{fact.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
