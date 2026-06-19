import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

type RevalidatableTourPackage = {
  availabilityStatus?: string | null
  slug?: string | null
  _status?: string | null
}

const isPublicTourPackage = (doc?: RevalidatableTourPackage | null) => {
  return doc?._status === 'published' && doc?.availabilityStatus === 'active'
}

const revalidateTourPackagePaths = (slug?: string | null) => {
  revalidatePath('/tour-packages')
  revalidatePath('/tour-packages/category')
  revalidateTag('tour-packages-sitemap', 'max')

  if (slug) {
    revalidatePath(`/tour-packages/${slug}`)
  }
}

export const revalidateTourPackage: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const tourPackage = doc as RevalidatableTourPackage
    const previousTourPackage = previousDoc as RevalidatableTourPackage | undefined

    if (isPublicTourPackage(tourPackage)) {
      payload.logger.info(`Revalidating tour package at path: /tour-packages/${tourPackage.slug}`)
      revalidateTourPackagePaths(tourPackage.slug)
    }

    if (isPublicTourPackage(previousTourPackage) && !isPublicTourPackage(tourPackage)) {
      payload.logger.info(
        `Revalidating old tour package at path: /tour-packages/${previousTourPackage?.slug}`,
      )
      revalidateTourPackagePaths(previousTourPackage?.slug)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const tourPackage = doc as RevalidatableTourPackage

    revalidateTourPackagePaths(tourPackage?.slug)
  }

  return doc
}
