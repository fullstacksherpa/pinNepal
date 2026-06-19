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
        'flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Link className="block" href={`/tour-packages/${slug}`}>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {image ? (
            <Media
              fill
              imgClassName="object-cover transition-transform duration-300 hover:scale-105"
              pictureClassName="block h-full w-full"
              resource={image}
              size="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-muted-foreground">
              {title}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {showCategories && hasCategories && (
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
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

        <h2 className="text-2xl font-medium leading-tight">
          <Link href={`/tour-packages/${slug}`}>{title}</Link>
        </h2>

        {regionLabel && (
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="size-4" />
            {regionLabel}
          </p>
        )}

        {tagline && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{tagline}</p>
        )}

        <div className="mt-5 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          {durationLabel && (
            <span className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5">
              <CalendarDays className="size-3.5" />
              {durationLabel}
            </span>
          )}
          {difficulty && (
            <span className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5">
              <Mountain className="size-3.5" />
              {difficulty}
            </span>
          )}
          {startLocation && endLocation && (
            <span className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 sm:col-span-2">
              <MapPin className="size-3.5" />
              {startLocation} to {endLocation}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">From</p>
            <p className="mt-1 text-lg font-semibold">{price || 'Inquire'}</p>
          </div>
          {typeof rating === 'number' && (
            <p className="flex items-center gap-1 text-sm font-medium text-[#B23A48]">
              <Star className="size-4 fill-current" />
              {rating.toFixed(1)}
              {reviewCount ? <span className="text-muted-foreground">({reviewCount})</span> : null}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
