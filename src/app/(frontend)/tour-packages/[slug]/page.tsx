import type { Media as MediaType, TourPackage } from '@/payload-types'
import type { Metadata } from 'next'

import { CheckCircle2, CircleX, HelpCircle, Images, MessageCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { TourPackageArchive } from '@/components/TourPackageArchive'
import { TourPackageHero } from '@/heros/TourPackageHero'
import { TourPackageItineraryAccordion } from '@/components/TourPackageItineraryAccordion'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { generateMeta } from '@/utilities/generateMeta'
import { getPayload } from 'payload'
import { getWhatsAppHref } from '@/utilities/tourPackages'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const tourPackages = await payload.find({
    collection: 'tour-packages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
    where: {
      availabilityStatus: {
        equals: 'active',
      },
    },
  })

  return tourPackages.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function TourPackagePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/tour-packages/' + decodedSlug
  const tourPackage = await queryTourPackageBySlug({ slug: decodedSlug })

  if (!tourPackage) return <PayloadRedirects url={url} />

  const galleryImages =
    tourPackage.gallery?.filter((item) => item?.image && typeof item.image === 'object') || []
  const inclusions = tourPackage.inclusions?.filter((item) => item?.item) || []
  const exclusions = tourPackage.exclusions?.filter((item) => item?.item) || []
  const permits = tourPackage.licencesAndPermits?.filter((item) => item?.name) || []
  const faqs = tourPackage.faqs?.filter((item) => item?.question && item?.answer) || []
  const highlights = tourPackage.tripHighlights?.filter((item) => item?.name) || []
  const relatedPackages =
    tourPackage.relatedPackages?.filter((item) => item && typeof item === 'object') || []
  const whatsappHref = getWhatsAppHref({
    message: tourPackage.whatsappPrefillMessage,
    number: tourPackage.whatsappNumber,
    title: tourPackage.title,
  })

  return (
    <article className="pb-20">
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <TourPackageHero tourPackage={tourPackage} />

      <nav className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex gap-5 overflow-x-auto py-4 text-sm font-medium">
          <a className="whitespace-nowrap hover:text-[#B23A48]" href="#summary">
            Summary
          </a>
          <a className="whitespace-nowrap hover:text-[#B23A48]" href="#itinerary">
            Itinerary
          </a>
          <a className="whitespace-nowrap hover:text-[#B23A48]" href="#included">
            Included
          </a>
          {faqs.length > 0 && (
            <a className="whitespace-nowrap hover:text-[#B23A48]" href="#faqs">
              FAQs
            </a>
          )}
          {galleryImages.length > 0 && (
            <a className="whitespace-nowrap hover:text-[#B23A48]" href="#photos">
              Photos
            </a>
          )}
        </div>
      </nav>

      <div className="container grid gap-12 pt-14 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-16">
          <section id="summary">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B23A48]">
              Trip dossier
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">
              Know the route before you go
            </h2>
            {tourPackage.description && (
              <RichText
                className="mt-8 max-w-3xl"
                data={tourPackage.description}
                enableGutter={false}
              />
            )}
          </section>

          {highlights.length > 0 && (
            <section>
              <div className="mb-7 flex items-center gap-3">
                <ShieldCheck className="size-6 text-[#B23A48]" />
                <h2 className="text-3xl font-semibold">Trip highlights</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {highlights.map((highlight) => {
                  const image =
                    highlight.image && typeof highlight.image === 'object'
                      ? (highlight.image as MediaType)
                      : null

                  return (
                    <div
                      className="overflow-hidden rounded-lg border border-border bg-card"
                      key={highlight.id || highlight.name}
                    >
                      {image && (
                        <div className="relative aspect-[16/9] bg-muted">
                          <Media
                            fill
                            imgClassName="object-cover"
                            pictureClassName="block h-full w-full"
                            resource={image}
                            size="(max-width: 768px) 100vw, 40vw"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        {highlight.category && (
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {highlight.category}
                          </p>
                        )}
                        <h3 className="text-xl font-medium">{highlight.name}</h3>
                        {highlight.shortDescription && (
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {highlight.shortDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {tourPackage.itinerary && tourPackage.itinerary.length > 0 && (
            <section id="itinerary">
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B23A48]">
                  Day by day
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight">Itinerary</h2>
              </div>
              <TourPackageItineraryAccordion days={tourPackage.itinerary} />
            </section>
          )}

          <section id="included">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle2 className="size-6 text-[#2F855A]" />
                  <h2 className="text-3xl font-semibold">Included</h2>
                </div>
                <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                  {inclusions.map((item) => (
                    <li className="flex gap-3" key={item.id || item.item}>
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#2F855A]" />
                      <span>{item.item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-5 flex items-center gap-3">
                  <CircleX className="size-6 text-[#B23A48]" />
                  <h2 className="text-3xl font-semibold">Not included</h2>
                </div>
                <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
                  {exclusions.map((item) => (
                    <li className="flex gap-3" key={item.id || item.item}>
                      <CircleX className="mt-1 size-4 shrink-0 text-[#B23A48]" />
                      <span>{item.item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {permits.length > 0 && (
            <section>
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="size-6 text-[#D69E2E]" />
                <h2 className="text-3xl font-semibold">Licences and permits</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {permits.map((permit) => (
                  <div
                    className="rounded-lg border border-border bg-card p-5"
                    key={permit.id || permit.name}
                  >
                    <h3 className="text-lg font-medium">{permit.name}</h3>
                    {permit.issuedBy && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Issued by {permit.issuedBy}
                      </p>
                    )}
                    <p className="mt-3 text-sm font-medium">
                      {permit.includedInPrice ? 'Included in price' : 'Paid separately'}
                    </p>
                    {permit.notes && (
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{permit.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {faqs.length > 0 && (
            <section id="faqs">
              <div className="mb-6 flex items-center gap-3">
                <HelpCircle className="size-6 text-[#B23A48]" />
                <h2 className="text-3xl font-semibold">Useful info</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details
                    className="rounded-lg border border-border bg-card p-5"
                    key={faq.id || faq.question}
                  >
                    <summary className="cursor-pointer text-lg font-medium">{faq.question}</summary>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {galleryImages.length > 0 && (
            <section id="photos">
              <div className="mb-6 flex items-center gap-3">
                <Images className="size-6 text-[#B23A48]" />
                <h2 className="text-3xl font-semibold">Photos from the trip</h2>
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

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Ready to plan?
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Talk to PinNepal about this route.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Share your dates, group size, and preferred pace. We&apos;ll help shape this itinerary
              into the right private or small-group journey.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {whatsappHref && (
                <Button asChild className="bg-[#B23A48] text-white hover:bg-[#9c2f3e]">
                  <a href={whatsappHref} target="_blank">
                    <MessageCircle className="size-4" />
                    Chat to book
                  </a>
                </Button>
              )}
              <Button asChild variant="outline">
                <a href="#itinerary">Review itinerary</a>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {relatedPackages.length > 0 && (
        <section className="mt-20">
          <div className="container mb-8">
            <h2 className="text-3xl font-semibold">Related packages</h2>
          </div>
          <TourPackageArchive tourPackages={relatedPackages as TourPackage[]} />
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const tourPackage = await queryTourPackageBySlug({ slug: decodedSlug })

  return generateMeta({ collection: 'tour-packages', doc: tourPackage })
}

const queryTourPackageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'tour-packages',
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
