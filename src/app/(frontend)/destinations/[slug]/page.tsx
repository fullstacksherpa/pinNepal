import type { Metadata } from 'next'

import { DestinationHero } from '@/heros/DestinationHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { generateMeta } from '@/utilities/generateMeta'
import { getPayload } from 'payload'
import React, { cache } from 'react'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const destinations = await payload.find({
    collection: 'destinations',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return destinations.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Destination({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/destinations/' + decodedSlug
  const destination = await queryDestinationBySlug({ slug: decodedSlug })

  if (!destination) return <PayloadRedirects url={url} />

  const galleryImages =
    destination.gallery?.filter((item) => item?.image && typeof item.image === 'object') || []

  return (
    <article className="pb-16">
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <DestinationHero destination={destination} />

      <div className="container pt-12">
        {destination.content && (
          <RichText className="max-w-3xl mx-auto" data={destination.content} enableGutter={false} />
        )}

        {destination.thingsToDo && destination.thingsToDo.length > 0 && (
          <section className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-3xl font-medium">Things to do</h2>
            <ul className="mt-6 list-disc space-y-3 pl-6">
              {destination.thingsToDo.map((item) =>
                item.activity ? <li key={item.id || item.activity}>{item.activity}</li> : null,
              )}
            </ul>
          </section>
        )}

        {destination.howToGetThere && (
          <section className="mt-12">
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-3xl font-medium">How to get there</h2>
            </div>
            <RichText
              className="max-w-3xl mx-auto"
              data={destination.howToGetThere}
              enableGutter={false}
            />
          </section>
        )}

        {galleryImages.length > 0 && (
          <section className="mt-12">
            <div className="mx-auto mb-6 max-w-3xl">
              <h2 className="text-3xl font-medium">Gallery</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((item) => (
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                  key={item.id}
                >
                  {item.image && typeof item.image === 'object' && (
                    <Media
                      fill
                      imgClassName="object-cover"
                      pictureClassName="block h-full w-full"
                      resource={item.image}
                      size="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const destination = await queryDestinationBySlug({ slug: decodedSlug })

  return generateMeta({ collection: 'destinations', doc: destination })
}

const queryDestinationBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'destinations',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
