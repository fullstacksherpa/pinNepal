import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { FAQ_CACHE_REVALIDATE_PROFILE, FAQ_CACHE_TAG } from '@/constants'
import { revalidateTag } from 'next/cache'

const revalidateFAQsCache = () => {
  revalidateTag(FAQ_CACHE_TAG, FAQ_CACHE_REVALIDATE_PROFILE)
}

export const revalidateFAQs: CollectionAfterChangeHook = ({ doc, req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating FAQs cache')
    revalidateFAQsCache()
  }

  return doc
}

export const revalidateFAQsDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateFAQsCache()
  }

  return doc
}
