'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Blog, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

type CardAuthor = {
  id?: string | null
  image?: number | MediaType | null
  name?: string | null
  title?: string | null
}

export type CardBlogData = Pick<Blog, 'slug' | 'categories' | 'meta' | 'title'> & {
  populatedAuthors?: CardAuthor[] | null
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardBlogData
  relationTo?: 'blogs'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const cardRef = card.ref
  const linkRef = link.ref
  const setCardRef = React.useCallback(
    (node: HTMLElement | null) => {
      cardRef.current = node
    },
    [cardRef],
  )
  const setLinkRef = React.useCallback(
    (node: HTMLAnchorElement | null) => {
      linkRef.current = node
    },
    [linkRef],
  )
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, populatedAuthors, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const author = populatedAuthors?.find((author) => author?.name || author?.title || author?.image)
  const authorImage = author?.image
  const authorName = author?.name
  const authorTitle = author?.title
  const authorInitials = authorName
    ?.split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = relationTo === 'blogs' ? `/blog/${slug}` : '#'

  return (
    <article
      className={cn(
        'overflow-hidden rounded-[var(--radius-card)] border border-[var(--pn-border)] bg-white transition-shadow duration-300 hover:cursor-pointer hover:shadow-[0_18px_46px_rgba(28,46,94,0.1)]',
        className,
      )}
      ref={setCardRef}
    >
      <div className="relative w-full ">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>
      <div className="p-4">
        {showCategories && hasCategories && (
          <div className="mb-4 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[var(--pn-orange)]">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { slug: categorySlug, title: titleFromCategory } = category

                const categoryTitle = titleFromCategory || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categorySlug ? (
                      <Link
                        className="relative z-10 hover:underline"
                        href={`/blog/category/${categorySlug}`}
                      >
                        {categoryTitle}
                      </Link>
                    ) : (
                      categoryTitle
                    )}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <div>
            <h3 className="font-serif text-2xl font-bold leading-tight text-[var(--pn-navy)]">
              <Link className="not-prose" href={href} ref={setLinkRef}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {author && (
          <div className="mt-4 flex min-w-0 items-center gap-3 text-sm">
            <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--pn-sage-light)] text-xs font-semibold text-[var(--pn-sage-dark)]">
              {authorImage && typeof authorImage === 'object' ? (
                <Media
                  fill
                  imgClassName="object-cover"
                  pictureClassName="block h-full w-full"
                  resource={authorImage}
                  size="36px"
                />
              ) : (
                <span>{authorInitials || 'PN'}</span>
              )}
            </div>
            <div className="min-w-0">
              {authorName && (
                <p className="truncate font-semibold leading-none text-[var(--pn-navy)]">
                  {authorName}
                </p>
              )}
              {authorTitle && (
                <p className="mt-1 truncate leading-none text-[var(--pn-mist)]">{authorTitle}</p>
              )}
            </div>
          </div>
        )}
        {description && (
          <div className="mt-3 text-sm leading-6 text-[var(--pn-body)]">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </article>
  )
}
