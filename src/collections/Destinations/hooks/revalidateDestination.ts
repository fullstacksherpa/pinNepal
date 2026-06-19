import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

type RevalidatableDestination = {
  slug?: string | null
  _status?: string | null
}

const revalidateDestinationPaths = (slug?: string | null) => {
  revalidatePath('/destinations')
  revalidatePath('/destinations/category')
  revalidateTag('destinations-sitemap', 'max')

  if (slug) {
    revalidatePath(`/destinations/${slug}`)
  }
}

export const revalidateDestination: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const destination = doc as RevalidatableDestination
    const previousDestination = previousDoc as RevalidatableDestination | undefined

    if (destination._status === 'published') {
      payload.logger.info(`Revalidating destination at path: /destinations/${destination.slug}`)
      revalidateDestinationPaths(destination.slug)
    }

    if (previousDestination?._status === 'published' && destination._status !== 'published') {
      payload.logger.info(
        `Revalidating old destination at path: /destinations/${previousDestination.slug}`,
      )
      revalidateDestinationPaths(previousDestination.slug)
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const destination = doc as RevalidatableDestination

    revalidateDestinationPaths(destination?.slug)
  }

  return doc
}
