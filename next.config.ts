import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { redirects } from './redirects'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const nextConfig: NextConfig = {
  // Required for Payload Admin UI styles to resolve correctly
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },

  // Your updated Bunny Optimizer Configuration
  images: {
    loader: 'custom',
    loaderFile: './src/utilities/bunny-loader.ts',
    // ADDED: Tell Next.js that quality=100 is allowed
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.b-cdn.net', // Captures your Bunny CDN domains
      },
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
    ],
  },

  // Required for Payload's internal file extensions parsing
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },

  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
}

// Keep the withPayload wrapper intact so the CMS works perfectly alongside Next.js
export default withPayload(nextConfig, { devBundleServerPackages: false })
