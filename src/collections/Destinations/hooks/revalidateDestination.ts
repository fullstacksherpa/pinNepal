import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateDestinationContent } from '@/utilities/revalidateContent'

type RevalidatableDestination = {
  slug?: string | null
  _status?: string | null
}

const isPublishedDestination = (doc?: RevalidatableDestination | null) => {
  return doc?._status === 'published'
}

export const revalidateDestination: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const destination = doc as RevalidatableDestination
    const previousDestination = previousDoc as RevalidatableDestination | undefined

    if (isPublishedDestination(destination)) {
      payload.logger.info(`Revalidating destination at path: /destinations/${destination.slug}`)
      revalidateDestinationContent(destination.slug)
    }

    if (
      previousDestination &&
      isPublishedDestination(previousDestination) &&
      (!isPublishedDestination(destination) || previousDestination.slug !== destination.slug)
    ) {
      payload.logger.info(
        `Revalidating old destination at path: /destinations/${previousDestination.slug}`,
      )
      revalidateDestinationContent(previousDestination.slug)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const destination = doc as RevalidatableDestination

    revalidateDestinationContent(destination?.slug)
  }

  return doc
}
