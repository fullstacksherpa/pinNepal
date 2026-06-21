import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateDestinationCategoryContent } from '@/utilities/revalidateContent'

export const revalidateDestinationCategory: CollectionAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating destination category pages for category: ${doc?.slug}`)
    revalidateDestinationCategoryContent()
  }

  return doc
}

export const revalidateDestinationCategoryDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidateDestinationCategoryContent()
  }

  return doc
}
