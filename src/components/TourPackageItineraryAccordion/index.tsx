'use client'

import type { TourPackage } from '@/payload-types'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Clock, Footprints, MapPinned, Utensils } from 'lucide-react'
import { Media } from '@/components/Media'
import React from 'react'
import { formatDifficulty, getActivityFacts, getMealLabels } from '@/utilities/tourPackages'

type ItineraryDay = NonNullable<TourPackage['itinerary']>[number]

const getDayKey = (day: ItineraryDay, index: number) => {
  return day.id || `${day.day || index + 1}-${day.title || 'day'}`
}

export const TourPackageItineraryAccordion: React.FC<{
  days: ItineraryDay[]
}> = ({ days }) => {
  if (!days.length) return null

  return (
    <Accordion className="space-y-4" defaultValue={[getDayKey(days[0], 0)]} type="multiple">
      {days.map((day, index) => {
        const value = getDayKey(day, index)
        const meals = getMealLabels(day.meals)
        const activityFacts = getActivityFacts(day.activity)
        const image = day.image && typeof day.image === 'object' ? day.image : null
        const optionalActivities =
          day.optionalActivities?.filter((item) => item?.activity).map((item) => item.activity) ||
          []
        const options =
          day.options?.filter((option) => option?.optionId || option?.optionTitle) || []

        return (
          <AccordionItem
            className="relative overflow-hidden rounded-lg border border-border bg-background pl-10"
            key={value}
            value={value}
          >
            <div className="absolute bottom-0 left-5 top-0 w-px bg-border" />
            <div className="absolute left-[0.78rem] top-5 flex size-8 items-center justify-center rounded-full border border-[#B23A48] bg-background text-xs font-semibold text-[#B23A48]">
              {day.day || index + 1}
            </div>

            <AccordionTrigger className="px-5 py-5 text-left hover:no-underline">
              <span className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Day {day.day || index + 1}
                </span>
                <span className="text-xl font-medium">{day.title}</span>
              </span>
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div>
                  {day.description && (
                    <p className="text-base leading-7 text-muted-foreground">{day.description}</p>
                  )}

                  {day.highlights && day.highlights.length > 0 && (
                    <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                      {day.highlights.map((item) =>
                        item.highlight ? (
                          <li key={item.id || item.highlight}>{item.highlight}</li>
                        ) : null,
                      )}
                    </ul>
                  )}

                  {options.length > 0 && (
                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      {options.map((option) => {
                        const optionFacts = getActivityFacts(option.activity)
                        const optionDifficulty = formatDifficulty(option.difficultyLevel)

                        return (
                          <div
                            className="rounded-lg border border-border bg-card p-4"
                            key={option.id || option.optionId}
                          >
                            <p className="text-sm font-semibold">
                              {option.optionLabel || option.optionTitle || option.optionId}
                            </p>
                            {option.optionTitle && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {option.optionTitle}
                              </p>
                            )}
                            {option.description && (
                              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                {option.description}
                              </p>
                            )}
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {optionDifficulty && (
                                <span className="rounded-md border border-border px-2 py-1">
                                  {optionDifficulty}
                                </span>
                              )}
                              {optionFacts.map((fact) => (
                                <span
                                  className="rounded-md border border-border px-2 py-1"
                                  key={fact}
                                >
                                  {fact}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <aside className="space-y-4">
                  {image && (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <Media
                        fill
                        imgClassName="object-cover"
                        pictureClassName="block h-full w-full"
                        resource={image}
                        size="(max-width: 1024px) 100vw, 18rem"
                      />
                    </div>
                  )}

                  <div className="grid gap-2 text-sm text-muted-foreground">
                    {day.accommodation && (
                      <p className="flex gap-2">
                        <MapPinned className="mt-0.5 size-4 shrink-0 text-[#B23A48]" />
                        <span>{day.accommodation}</span>
                      </p>
                    )}
                    {meals.length > 0 && (
                      <p className="flex gap-2">
                        <Utensils className="mt-0.5 size-4 shrink-0 text-[#B23A48]" />
                        <span>{meals.join(', ')}</span>
                      </p>
                    )}
                    {activityFacts.length > 0 && (
                      <p className="flex gap-2">
                        <Footprints className="mt-0.5 size-4 shrink-0 text-[#B23A48]" />
                        <span>{activityFacts.join(' / ')}</span>
                      </p>
                    )}
                    {optionalActivities.length > 0 && (
                      <p className="flex gap-2">
                        <Clock className="mt-0.5 size-4 shrink-0 text-[#B23A48]" />
                        <span>Optional: {optionalActivities.join(', ')}</span>
                      </p>
                    )}
                  </div>
                </aside>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
