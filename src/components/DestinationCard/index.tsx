import type { Destination, DestinationCategory, District, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import Link from 'next/link'
import React, { Fragment } from 'react'

export type DestinationCardData = Pick<
  Destination,
  | 'bestTimeToVisit'
  | 'categories'
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
  showCategories?: boolean
}> = ({ className, destination, showCategories }) => {
  const {
    bestTimeToVisit,
    categories,
    difficulty,
    district,
    heroImage,
    name,
    recommendedDuration,
    slug,
    summary,
  } = destination

  const districtLabel = getDistrictLabel(district)
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const image = heroImage && typeof heroImage === 'object' ? (heroImage as MediaType) : null
  const detailItems = [
    recommendedDuration,
    difficulty,
    bestTimeToVisit && bestTimeToVisit.length > 0 ? bestTimeToVisit.join(', ') : null,
  ].filter(Boolean)

  return (
    <article
      className={[
        'flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--pn-border)] bg-white',
        'transition-shadow duration-300 hover:shadow-[0_18px_46px_rgba(28,46,94,0.1)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Link className="block" href={`/destinations/${slug}`}>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--pn-sage)]">
          {image ? (
            <Media
              fill
              imgClassName="object-cover transition-transform duration-300 hover:scale-105"
              pictureClassName="block h-full w-full"
              resource={image}
              size="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-white/80">
              {name}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {showCategories && hasCategories && (
          <div className="mb-4 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[var(--pn-orange)]">
            {categories?.map((category, index) => {
              if (!category || typeof category !== 'object') return null

              const typedCategory = category as DestinationCategory
              const isLast = index === categories.length - 1

              return (
                <Fragment key={typedCategory.id}>
                  {typedCategory.slug ? (
                    <Link
                      className="relative z-10 hover:underline"
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

        <h2 className="font-serif text-2xl font-bold leading-tight text-[var(--pn-navy)]">
          <Link href={`/destinations/${slug}`}>{name}</Link>
        </h2>

        {districtLabel && (
          <p className="mt-3 text-sm font-semibold text-[var(--pn-mist)]">{districtLabel}</p>
        )}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--pn-body)]">{summary}</p>

        {detailItems.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs text-[var(--pn-mist)]">
            {detailItems.map((item) => (
              <span
                className="rounded-[var(--radius-btn)] border border-[var(--pn-border)] px-2 py-1"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
