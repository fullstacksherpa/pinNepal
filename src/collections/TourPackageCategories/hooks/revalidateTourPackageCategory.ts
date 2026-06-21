import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTourPackageCategoryContent } from '@/utilities/revalidateContent'

export const revalidateTourPackageCategory: CollectionAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating tour package category pages for category: ${doc?.slug}`)
    revalidateTourPackageCategoryContent()
  }

  return doc
}

export const revalidateTourPackageCategoryDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidateTourPackageCategoryContent()
  }

  return doc
}
