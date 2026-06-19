import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

async function getDocument(collection: Collection, id: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  return payload.findByID({
    collection,
    id,
    depth,
  })
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, id: string) =>
  unstable_cache(async () => getDocument(collection, id), [collection, id], {
    tags: [`${collection}_${id}`],
  })
