import type { Media as MediaType, TourPackage, TourPackageCategory } from '@/payload-types'

import { CalendarDays, MapPin, Mountain, Star } from 'lucide-react'
import { Fragment } from 'react'
import { Media } from '@/components/Media'
import Link from 'next/link'
import React from 'react'
import { formatCurrency, formatDifficulty, getRegionLabel } from '@/utilities/tourPackages'

export type TourPackageCardData = Pick<
  TourPackage,
  | 'categories'
  | 'coverImage'
  | 'currency'
  | 'difficultyLevel'
  | 'endLocation'
  | 'id'
  | 'pricePerPerson'
  | 'rating'
  | 'region'
  | 'reviewCount'
  | 'slug'
  | 'startLocation'
  | 'tagline'
  | 'title'
  | 'totalDays'
  | 'totalNights'
>

export const TourPackageCard: React.FC<{
  className?: string
  showCategories?: boolean
  tourPackage: TourPackageCardData
}> = ({ className, showCategories, tourPackage }) => {
  const {
    categories,
    coverImage,
    currency,
    difficultyLevel,
    endLocation,
    pricePerPerson,
    rating,
    region,
    reviewCount,
    slug,
    startLocation,
    tagline,
    title,
    totalDays,
    totalNights,
  } = tourPackage

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const image = coverImage && typeof coverImage === 'object' ? (coverImage as MediaType) : null
  const price = formatCurrency(pricePerPerson, currency || 'NPR')
  const regionLabel = getRegionLabel(region)
  const difficulty = formatDifficulty(difficultyLevel)
  const durationLabel = totalDays
    ? `${totalDays} day${totalDays === 1 ? '' : 's'}${totalNights ? ` / ${totalNights} nights` : ''}`
    : null

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
      <Link className="block" href={`/tour-packages/${slug}`}>
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
              {title}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {showCategories && hasCategories && (
          <div className="mb-4 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[var(--pn-orange)]">
            {categories?.map((category, index) => {
              if (!category || typeof category !== 'object') return null

              const typedCategory = category as TourPackageCategory
              const isLast = index === categories.length - 1

              return (
                <Fragment key={typedCategory.id}>
                  {typedCategory.slug ? (
                    <Link
                      className="relative z-10 hover:underline"
                      href={`/tour-packages/category/${typedCategory.slug}`}
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
          <Link href={`/tour-packages/${slug}`}>{title}</Link>
        </h2>

        {regionLabel && (
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[var(--pn-mist)]">
            <MapPin className="size-4" />
            {regionLabel}
          </p>
        )}

        {tagline && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--pn-body)]">{tagline}</p>
        )}

        <div className="mt-5 grid gap-2 font-mono text-xs text-[var(--pn-mist)] sm:grid-cols-2">
          {durationLabel && (
            <span className="flex items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--pn-border)] px-2 py-1.5">
              <CalendarDays className="size-3.5" />
              {durationLabel}
            </span>
          )}
          {difficulty && (
            <span className="flex items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--pn-border)] px-2 py-1.5">
              <Mountain className="size-3.5" />
              {difficulty}
            </span>
          )}
          {startLocation && endLocation && (
            <span className="flex items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--pn-border)] px-2 py-1.5 sm:col-span-2">
              <MapPin className="size-3.5" />
              {startLocation} to {endLocation}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[var(--pn-mist)]">
              From
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-[var(--pn-navy)]">
              {price || 'Inquire'}
            </p>
          </div>
          {typeof rating === 'number' && (
            <p className="flex items-center gap-1 font-mono text-sm text-[var(--pn-orange)]">
              <Star className="size-4 fill-current" />
              {rating.toFixed(1)}
              {reviewCount ? <span className="text-[var(--pn-mist)]">({reviewCount})</span> : null}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
