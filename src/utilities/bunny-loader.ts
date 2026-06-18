'use client'

export default function bunnyLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  // If Payload returns a full absolute URL, use it; otherwise, fall back to your environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BUNNY_CDN_URL || 'https://pin-nepal.b-cdn.net'
  const url = src.startsWith('http') ? new URL(src) : new URL(src, baseUrl)

  // Apply Bunny Optimizer real-time manipulation parameters
  url.searchParams.set('width', width.toString())

  if (quality) {
    url.searchParams.set('quality', quality.toString())
  }

  return url.toString()
}
