import type { Destination, District, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { ArrowUpRight, CalendarDays, Clock3, MapPin, MountainSnow } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export type DestinationCardData = Pick<
  Destination,
  | 'bestTimeToVisit'
  | 'difficulty'
  | 'district'
  | 'heroImage'
  | 'id'
  | 'name'
  | 'recommendedDuration'
  | 'slug'
  | 'summary'
>

const getDistrictLabel = (district?: number | District | null) => {
  if (!district || typeof district !== 'object') return null

  const province = district.province
  const provinceName = province && typeof province === 'object' ? province.name : null

  return [district.name, provinceName].filter(Boolean).join(', ')
}

export const DestinationCard: React.FC<{
  className?: string
  destination: DestinationCardData
}> = ({ className, destination }) => {
  const {
    bestTimeToVisit,
    difficulty,
    district,
    heroImage,
    name,
    recommendedDuration,
    slug,
    summary,
  } = destination

  const districtLabel = getDistrictLabel(district)
  const image = heroImage && typeof heroImage === 'object' ? (heroImage as MediaType) : null

  const bestSeason =
    bestTimeToVisit && bestTimeToVisit.length > 0 ? bestTimeToVisit.join(', ') : null

  const detailItems = [
    recommendedDuration
      ? {
          icon: Clock3,
          label: 'Days',
          value: recommendedDuration,
        }
      : null,
    difficulty
      ? {
          icon: MountainSnow,
          label: 'Grade',
          value: difficulty,
        }
      : null,
    bestSeason
      ? {
          icon: CalendarDays,
          label: 'Season',
          value: bestSeason,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <article
      className={[
        'group relative h-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--pn-border)] bg-[var(--pn-green)]',
        'shadow-[0_18px_54px_rgba(28,46,94,0.1)]',
        'transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_72px_rgba(28,46,94,0.18)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Link
        className="relative block aspect-[4/5] min-h-[340px] overflow-hidden sm:aspect-[1/1]"
        href={`/destinations/${slug}`}
      >
        {image ? (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            pictureClassName="block h-full w-full"
            resource={image}
            size="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--pn-green)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,22,48,0.82)] via-[rgba(9,22,48,0.18)] to-transparent transition-opacity duration-500 group-hover:opacity-95" />

        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[var(--pn-orange)] group-hover:bg-[var(--pn-orange)]">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5">
          {districtLabel && (
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/90">
              <MapPin className="h-4 w-4 text-[var(--pn-orange)]" />
              <span className="line-clamp-1">{districtLabel}</span>
            </div>
          )}

          <h2 className="font-serif text-3xl font-bold leading-none text-white drop-shadow-sm">
            {name}
          </h2>

          {summary && (
            <p className="mt-3 max-h-0 overflow-hidden text-sm leading-6 text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
              <span className="line-clamp-2">{summary}</span>
            </p>
          )}

          {detailItems.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-2">
              {detailItems.map(({ icon: Icon, label, value }) => (
                <div
                  className="min-w-0 rounded-xl border border-white/15 bg-white/[0.12] px-3 py-2 text-white backdrop-blur-md"
                  key={`${label}-${value}`}
                >
                  <div className="mb-1 flex items-center gap-1.5 font-mono text-[0.55rem] font-bold uppercase tracking-[0.16em] text-white/60">
                    <Icon className="h-3 w-3 text-[var(--pn-orange)]" />
                    {label}
                  </div>

                  <div className="truncate text-xs font-semibold text-white">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
