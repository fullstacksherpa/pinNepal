import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { bunnyStorage } from '@seshuk/payload-storage-bunny'
import type { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import type { Blog } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Blog> = ({ doc }) => {
  return doc?.title ? `${doc.title} | PinNepal` : 'PinNepal'
}

const generateURL: GenerateURL<Blog> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/blogs/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['blogs'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  searchPlugin({
    collections: ['blogs'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  bunnyStorage({
    collections: {
      media: {
        prefix: 'media',
        disablePayloadAccessControl: true,
      },
    },
    storage: {
      apiKey: process.env.BUNNY_STORAGE_API_KEY as string,
      hostname: process.env.BUNNY_HOSTNAME as string,
      region: process.env.BUNNY_STORAGE_REGION,
      zoneName: process.env.BUNNY_ZONE_NAME as string,
    },
    stream: {
      apiKey: process.env.BUNNY_STREAM_API_KEY as string,
      hostname: process.env.BUNNY_STREAM_HOSTNAME as string,
      libraryId: Number(process.env.BUNNY_STREAM_LIBRARY_ID),
      tus: true,
    },
    thumbnail: true,
  }),
]
