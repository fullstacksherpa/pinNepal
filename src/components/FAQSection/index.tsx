import type React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FAQ_CACHE_KEY, FAQ_CACHE_TAG } from '@/constants'
import configPromise from '@payload-config'
import { HelpCircle } from 'lucide-react'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type FAQItem = {
  id: number | string
  question: string
  answer: string
}

type FAQDocument = {
  id: number | string
  question?: string | null
  answer?: string | null
}

type FAQPayloadClient = {
  find: (args: {
    collection: 'faqs'
    depth: 0
    limit: number
    overrideAccess: false
    select: {
      answer: true
      question: true
    }
    sort: 'sortOrder'
  }) => Promise<{ docs: FAQDocument[] }>
}

const getErrorRecord = (error: unknown): Record<string, unknown> | null => {
  return error && typeof error === 'object' ? (error as Record<string, unknown>) : null
}

const hasUndefinedTableCode = (error: unknown): boolean => {
  const record = getErrorRecord(error)

  if (!record) return false
  if (record.code === '42P01') return true

  return hasUndefinedTableCode(record.cause)
}

const hasFAQRelationMessage = (error: unknown): boolean => {
  const record = getErrorRecord(error)

  if (!record) return false

  const message = record.message
  if (typeof message === 'string' && message.includes('relation "faqs" does not exist')) {
    return true
  }

  return hasFAQRelationMessage(record.cause)
}

const isMissingFAQTableError = (error: unknown): boolean => {
  return hasUndefinedTableCode(error) && hasFAQRelationMessage(error)
}

export const loadFAQItems = async (payload: FAQPayloadClient): Promise<FAQItem[]> => {
  try {
    const faqs = await payload.find({
      collection: 'faqs',
      depth: 0,
      limit: 8,
      overrideAccess: false,
      select: {
        answer: true,
        question: true,
      },
      sort: 'sortOrder',
    })

    return faqs.docs.filter(
      (faq): faq is FAQItem => Boolean(faq.id && faq.question && faq.answer),
    )
  } catch (error) {
    if (isMissingFAQTableError(error)) {
      return []
    }

    throw error
  }
}

export const getCachedFAQs = unstable_cache(
  async () => {
    const payload = (await getPayload({ config: configPromise })) as FAQPayloadClient

    return loadFAQItems(payload)
  },
  [FAQ_CACHE_KEY],
  {
    revalidate: false,
    tags: [FAQ_CACHE_TAG],
  },
)

export const FAQSectionContent: React.FC<{
  faqs: FAQItem[]
}> = ({ faqs }) => {
  if (!faqs.length) return null

  return (
    <section className="border-t border-[#D8E3DC] bg-[#EEF5F1] py-16 md:py-20">
      <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="max-w-xl">
          <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-[#B23A48] text-white shadow-sm">
            <HelpCircle className="size-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B23A48]">
            Before you go
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-[#102A2C] md:text-5xl">
            Trip questions, answered
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#47615C]">
            Practical notes for timing, permits, planning, and booking travel across Nepal.
          </p>
        </div>

        <Accordion className="space-y-3" collapsible defaultValue={String(faqs[0].id)} type="single">
          {faqs.map((faq, index) => (
            <AccordionItem
              className="overflow-hidden rounded-lg border border-[#C8D8D0] bg-white/90 px-5 shadow-sm transition-colors data-[state=open]:border-[#B23A48]/45"
              key={faq.id}
              value={String(faq.id)}
            >
              <AccordionTrigger className="gap-4 py-5 text-left text-base font-semibold leading-6 text-[#102A2C] hover:no-underline md:text-lg">
                <span className="flex items-start gap-4">
                  <span className="mt-0.5 font-mono text-xs font-semibold uppercase tracking-normal text-[#B23A48]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-10 text-base leading-7 text-[#47615C]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export async function FAQSection() {
  const validFaqs = await getCachedFAQs()

  return <FAQSectionContent faqs={validFaqs} />
}
