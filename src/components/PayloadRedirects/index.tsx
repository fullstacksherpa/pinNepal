import type React from 'react'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

const collectionPathMap = {
  blogs: '/blog',
  destinations: '/destinations',
} as const

type RedirectCollection = keyof typeof collectionPathMap
type RedirectableDocument = {
  slug?: string | null
}

const getRedirectPath = (collection: string | undefined, slug: string | null | undefined) => {
  if (!collection || !slug || !(collection in collectionPathMap)) return ''

  return `${collectionPathMap[collection as RedirectCollection]}/${slug}`
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as RedirectableDocument
      redirectUrl = getRedirectPath(collection, document?.slug)
    } else {
      const collection = redirectItem.to?.reference?.relationTo
      const slug =
        typeof redirectItem.to?.reference?.value === 'object'
          ? redirectItem.to?.reference?.value?.slug
          : ''
      redirectUrl = getRedirectPath(collection, slug)
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
