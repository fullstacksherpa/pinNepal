import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateBlogCategoryContent } from '@/utilities/revalidateContent'

export const revalidateBlogCategory: CollectionAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating blog category pages for category: ${doc?.slug}`)
    revalidateBlogCategoryContent()
  }

  return doc
}

export const revalidateBlogCategoryDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidateBlogCategoryContent()
  }

  return doc
}
