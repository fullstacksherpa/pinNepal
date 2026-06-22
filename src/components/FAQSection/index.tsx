import type React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FAQ_CACHE_KEY, FAQ_CACHE_TAG } from '@/constants'
import configPromise from '@payload-config'
import { CalendarClock, HelpCircle, MapPinned, Mountain, Route, Trees } from 'lucide-react'
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

    return faqs.docs.filter((faq): faq is FAQItem => Boolean(faq.id && faq.question && faq.answer))
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

const trailStats = [
  {
    label: 'Routes',
    value: 'Guidance',
    icon: Route,
  },
  {
    label: 'Permits',
    value: 'Notes',
    icon: MapPinned,
  },
  {
    label: 'Seasons',
    value: 'Timing',
    icon: CalendarClock,
  },
]

const boardDirections = ['right', 'left'] as const
type BoardDirection = (typeof boardDirections)[number]

const getBoardDirection = (index: number): BoardDirection => {
  return index % 2 === 0 ? 'right' : 'left'
}

const boardShapeClass = {
  right: '[clip-path:polygon(0_0,90%_0,100%_50%,90%_100%,0_100%)] pr-8 md:pr-10',
  left: '[clip-path:polygon(10%_0,100%_0,100%_100%,10%_100%,0_50%)] pl-8 md:pl-10',
}

const boardAlignClass = {
  right: 'md:ml-auto md:text-left',
  left: 'md:mr-auto md:text-left',
}

const connectorClass = {
  right: 'md:right-full md:mr-0',
  left: 'md:left-full md:ml-0',
}

const noteIndentClass = {
  right: 'md:mr-6',
  left: 'md:ml-6',
}

const FAQTrailBoardItem: React.FC<{
  faq: FAQItem
  index: number
}> = ({ faq, index }) => {
  const direction = getBoardDirection(index)

  return (
    <AccordionItem
      value={String(faq.id)}
      className={`group border-none ${boardAlignClass[direction]} relative w-full md:w-[calc(50%-1.75rem)]`}
    >
      {/* connector to center post */}
      <div
        aria-hidden="true"
        className={`absolute top-[2.05rem] hidden h-3 w-8 rounded-full bg-[#7b5437] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] md:block ${connectorClass[direction]}`}
      />

      {/* wood board */}
      <div
        className={`relative overflow-hidden rounded-[1.15rem] border border-[#7d5638] bg-[linear-gradient(180deg,#956640_0%,#7d5435_100%)] shadow-[0_12px_30px_rgba(72,43,20,0.16)] transition-all duration-300 group-data-[state=open]:-translate-y-0.5 group-data-[state=open]:shadow-[0_18px_40px_rgba(72,43,20,0.22)] ${boardShapeClass[direction]}`}
      >
        {/* subtle wood grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(175deg,rgba(255,255,255,0.18)_0px,rgba(255,255,255,0.06)_3px,rgba(0,0,0,0.05)_6px,rgba(255,255,255,0.02)_11px)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-3 h-px bg-white/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-3 h-px bg-black/10"
        />

        {/* bolts */}
        <div className="pointer-events-none absolute left-5 top-1/2 size-2.5 -translate-y-1/2 rounded-full border border-white/20 bg-[#5d3d27]" />
        <div className="pointer-events-none absolute right-5 top-1/2 size-2.5 -translate-y-1/2 rounded-full border border-white/20 bg-[#5d3d27]" />

        <AccordionTrigger className="gap-4 px-6 py-5 text-left text-white hover:no-underline md:px-7 md:py-6">
          <span className="flex w-full items-start gap-4">
            <span className="mt-1 shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#f7dfbf]">
              {String(index + 1).padStart(2, '0')}
            </span>

            <span className="flex-1 font-serif text-lg font-bold leading-7 text-white md:text-[1.45rem]">
              {faq.question}
            </span>
          </span>
        </AccordionTrigger>
      </div>

      {/* answer note */}
      <AccordionContent className="pb-0 pt-3">
        <div
          className={`relative rounded-[1.4rem] border border-[#dcc8a8] bg-[#fffaf0]/88 p-5 shadow-[0_12px_30px_rgba(68,52,30,0.08)] backdrop-blur-sm md:p-6 ${noteIndentClass[direction]}`}
        >
          {/* note pin */}
          <div className="absolute left-6 top-0 size-3 -translate-y-1/2 rounded-full border border-[#d3bea0] bg-[#f3e1bf]" />

          <p className="text-sm leading-7 text-(--pn-body) md:text-[0.98rem]">{faq.answer}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export const FAQSectionContent: React.FC<{
  faqs: FAQItem[]
}> = ({ faqs }) => {
  if (!faqs.length) return null

  return (
    <section className="relative overflow-hidden border-t border-(--pn-border) py-16 md:py-24">
      {/* soft atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-(--pn-sage)/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/20 to-transparent"
      />

      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          {/* left intro card */}
          <aside className="relative overflow-hidden rounded-(--radius-card) border border-(--pn-border) bg-white/65 p-6 shadow-sm backdrop-blur-sm md:p-8 lg:sticky lg:top-24">
            <div className="flex size-12 items-center justify-center rounded-full bg-(--pn-sage) text-white shadow-sm">
              <HelpCircle className="size-6" aria-hidden="true" />
            </div>

            <p className="mt-7 font-mono text-[0.64rem] uppercase tracking-[0.3em] text-(--pn-navy)">
              Trailhead guide
            </p>

            <h2 className="mt-3 max-w-md font-serif text-4xl font-bold leading-[0.98] text-(--pn-navy) md:text-5xl">
              FAQ
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-(--pn-body)">
              Think of this section like a trail junction: each sign points to an answer about
              permits, routes, timing, transport, and planning across Nepal.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-2">
              {trailStats.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    className="rounded-2xl border border-(--pn-border) bg-[#faf6ee]/80 p-3"
                    key={item.label}
                  >
                    <Icon className="mb-3 size-4 text-(--pn-orange)" aria-hidden="true" />
                    <p className="font-mono text-[0.56rem] uppercase tracking-[0.22em] text-(--pn-mist)">
                      {item.label}
                    </p>
                    <p className="mt-1 font-serif text-lg font-bold text-(--pn-navy)">
                      {item.value}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 rounded-[1.4rem] border border-(--pn-border) bg-(--pn-sage) p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Mountain className="size-5" aria-hidden="true" />
                </div>

                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-white/65">
                    Local note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/90">
                    The best trips in Nepal feel easier when you understand weather windows, permit
                    zones, trail style, and travel pace ahead of time.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* right trail board accordion */}
          <div className="relative">
            {/* center post */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 top-0 hidden w-4 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#8a5f3f_0%,#6b462f_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] md:block"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/5 md:block"
            />

            <Accordion
              type="single"
              collapsible
              defaultValue={String(faqs[0].id)}
              className="space-y-5 md:space-y-6"
            >
              {faqs.map((faq, index) => (
                <FAQTrailBoardItem faq={faq} index={index} key={faq.id} />
              ))}
            </Accordion>

            <div className="mt-6 rounded-(--radius-card) border border-dashed border-(--pn-border) bg-white/55 p-5 text-sm leading-6 text-(--pn-body) backdrop-blur-sm">
              <span className="font-semibold text-(--pn-navy)">Still choosing a route?</span> Tell
              us your travel month, comfort level, destination type, and group size — PinNepal can
              point you toward the right path.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export async function FAQSection() {
  const validFaqs = await getCachedFAQs()

  return <FAQSectionContent faqs={validFaqs} />
}
