import type { Metadata } from 'next'

import type { Config, Media } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    url = image.url ? serverUrl + image.url : url
  }

  return url
}

type MetaCompatibleDoc = {
  heroImage?: Config['db']['defaultIDType'] | Media | null
  coverImage?: Config['db']['defaultIDType'] | Media | null
  meta?: {
    description?: string | null
    image?: Config['db']['defaultIDType'] | Media | null
    title?: string | null
  } | null
  name?: string | null
  seo?: {
    metaDescription?: string | null
    metaTitle?: string | null
    ogImage?: Config['db']['defaultIDType'] | Media | null
  } | null
  slug?: string | null
  title?: string | null
}

export const generateMeta = async (args: {
  collection?: 'blogs' | 'destinations' | 'tour-packages'
  doc: MetaCompatibleDoc | null
}): Promise<Metadata> => {
  const { collection = 'blogs', doc } = args

  const isDestination = collection === 'destinations'
  const isTourPackage = collection === 'tour-packages'
  const description =
    isDestination || isTourPackage ? doc?.seo?.metaDescription : doc?.meta?.description
  const image = isDestination
    ? doc?.heroImage
    : isTourPackage
      ? doc?.seo?.ogImage || doc?.coverImage
      : doc?.meta?.image
  const metaTitle =
    isDestination || isTourPackage
      ? doc?.seo?.metaTitle || doc?.name || doc?.title
      : doc?.meta?.title

  const ogImage = getImageURL(image)

  const title = metaTitle ? metaTitle + ' | PinNepal' : 'PinNepal'
  const pathPrefix = isDestination ? '/destinations' : isTourPackage ? '/tour-packages' : '/blog'

  return {
    description: description || undefined,
    openGraph: mergeOpenGraph({
      description: description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: doc?.slug ? `${pathPrefix}/${doc.slug}` : '/',
    }),
    title,
  }
}
