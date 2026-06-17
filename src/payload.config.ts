import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { bunnyStorage } from '@seshuk/payload-storage-bunny'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { Categories } from './collections/Categories'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'

import { Media } from './collections/Media'
import { Videos } from './collections/Videos'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL as string, // Safe cast
      ssl: { rejectUnauthorized: false },
    },
  }),
  // FIX: Added Videos to the collections array!
  collections: [Pages, Posts, Media, Videos, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    // 1. Restore the Form Builder plugin (this creates the 'forms' collection automatically)
    formBuilderPlugin({
      fields: {
        payment: false,
      },
    }),
    bunnyStorage({
      collections: {
        media: {
          prefix: 'images',
          disablePayloadAccessControl: true,
          // Removed: stream: false
        },
        videos: {
          storage: false,
          prefix: 'videos',
          disablePayloadAccessControl: true,
          // Removed: storage: false
          stream: {
            mp4Fallback: true,
          },
        },
      } as Record<string, any>, // <--- THE FIX IS HERE
      storage: {
        // FIX: Cast environment variables as string
        apiKey: process.env.BUNNY_STORAGE_API_KEY as string,
        hostname: process.env.BUNNY_HOSTNAME as string,
        zoneName: process.env.BUNNY_ZONE_NAME as string,
        region: 'sg',
      },
      stream: {
        // FIX: Cast environment variables as string
        apiKey: process.env.BUNNY_STREAM_API_KEY as string,
        hostname: process.env.BUNNY_STREAM_HOSTNAME as string,
        libraryId: Number(process.env.BUNNY_STREAM_LIBRARY_ID), // Number() already handles the cast implicitly
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET as string, // Safe cast
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        if (!secret) return false
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
