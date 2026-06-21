import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateBlogContent } from '@/utilities/revalidateContent'

import type { Blog } from '../../../payload-types'

const isPublishedBlog = (doc?: Pick<Blog, '_status'> | null) => {
  return doc?._status === 'published'
}

export const revalidateBlog: CollectionAfterChangeHook<Blog> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (isPublishedBlog(doc)) {
      const path = `/blog/${doc.slug}`

      payload.logger.info(`Revalidating blog at path: ${path}`)

      revalidateBlogContent(doc.slug)
    }

    if (isPublishedBlog(previousDoc) && (!isPublishedBlog(doc) || previousDoc.slug !== doc.slug)) {
      const oldPath = `/blog/${previousDoc.slug}`

      payload.logger.info(`Revalidating old blog at path: ${oldPath}`)

      revalidateBlogContent(previousDoc.slug)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Blog> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateBlogContent(doc?.slug)
  }

  return doc
}
