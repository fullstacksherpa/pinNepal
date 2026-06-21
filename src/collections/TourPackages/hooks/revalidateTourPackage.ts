import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTourPackageContent } from '@/utilities/revalidateContent'

type RevalidatableTourPackage = {
  availabilityStatus?: string | null
  slug?: string | null
  _status?: string | null
}

const isPublicTourPackage = (doc?: RevalidatableTourPackage | null) => {
  return doc?._status === 'published' && doc?.availabilityStatus === 'active'
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
      revalidateTourPackageContent(tourPackage.slug)
    }

    if (
      previousTourPackage &&
      isPublicTourPackage(previousTourPackage) &&
      (!isPublicTourPackage(tourPackage) || previousTourPackage.slug !== tourPackage.slug)
    ) {
      payload.logger.info(
        `Revalidating old tour package at path: /tour-packages/${previousTourPackage?.slug}`,
      )
      revalidateTourPackageContent(previousTourPackage?.slug)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const tourPackage = doc as RevalidatableTourPackage

    revalidateTourPackageContent(tourPackage?.slug)
  }

  return doc
}
