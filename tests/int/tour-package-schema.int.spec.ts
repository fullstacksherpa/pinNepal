import 'dotenv/config'

import { describe, expect, it } from 'vitest'
import config from '../../src/payload.config'
import { tourPackageCategorySeedData } from '../../src/seed/tourPackageCategories'
import type { Field } from 'payload'

const collectFieldNames = (fields: Field[]): string[] => {
  return fields.flatMap((field) => {
    const ownName = 'name' in field ? [field.name] : []

    if ('fields' in field && Array.isArray(field.fields)) {
      return [...ownName, ...collectFieldNames(field.fields)]
    }

    if ('tabs' in field && Array.isArray(field.tabs)) {
      return [
        ...ownName,
        ...field.tabs.flatMap((tab) => ('fields' in tab ? collectFieldNames(tab.fields) : [])),
      ]
    }

    return ownName
  })
}

describe('tour package schema', () => {
  it('registers tour package collections with the existing core collections', async () => {
    const payloadConfig = await config
    const collectionSlugs = payloadConfig.collections.map((collection) => collection.slug)

    expect(collectionSlugs).toEqual(
      expect.arrayContaining([
        'tour-packages',
        'tour-package-categories',
        'destinations',
        'destination-categories',
        'districts',
        'media',
        'users',
      ]),
    )
  })

  it('defines package categories with editable title and slug fields', async () => {
    const payloadConfig = await config
    const categories = payloadConfig.collections.find(
      (collection) => collection.slug === 'tour-package-categories',
    )

    expect(categories).toBeDefined()
    expect(categories ? collectFieldNames(categories.fields) : []).toEqual(
      expect.arrayContaining(['title', 'slug']),
    )
  })

  it('defines structured package editorial, pricing, itinerary, taxonomy, and SEO fields', async () => {
    const payloadConfig = await config
    const packages = payloadConfig.collections.find(
      (collection) => collection.slug === 'tour-packages',
    )

    expect(packages).toBeDefined()

    const fieldNames = packages ? collectFieldNames(packages.fields) : []

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        'title',
        'slug',
        'tagline',
        'description',
        'coverImage',
        'gallery',
        'startLocation',
        'endLocation',
        'totalDays',
        'totalNights',
        'averageGroupSize',
        'minGroupSize',
        'maxGroupSize',
        'difficultyLevel',
        'difficultyLabel',
        'difficultyDescription',
        'currency',
        'pricePerPerson',
        'taxesIncluded',
        'singleSupplement',
        'depositAmount',
        'whatsappNumber',
        'whatsappPrefillMessage',
        'rating',
        'reviewCount',
        'tripHighlights',
        'itinerary',
        'meals',
        'activity',
        'inclusions',
        'exclusions',
        'licencesAndPermits',
        'faqs',
        'tags',
        'region',
        'categories',
        'relatedPackages',
        'availabilityStatus',
        'seo',
        'metaTitle',
        'metaDescription',
        'ogImage',
      ]),
    )
  })

  it('uses Payload drafts and an availability status instead of a custom draft status', async () => {
    const payloadConfig = await config
    const packages = payloadConfig.collections.find(
      (collection) => collection.slug === 'tour-packages',
    )

    expect(packages?.versions).toMatchObject({
      drafts: {
        schedulePublish: true,
      },
      maxPerDoc: 50,
    })

    const availabilityStatus = packages?.fields.find(
      (field) => 'name' in field && field.name === 'availabilityStatus',
    ) as { defaultValue?: unknown; options?: { value: string }[] } | undefined

    expect(availabilityStatus?.defaultValue).toBe('active')
    expect(availabilityStatus?.options?.map((option) => option.value)).toEqual([
      'active',
      'archived',
    ])
  })

  it('keeps the requested tour package category seed data complete', () => {
    expect(tourPackageCategorySeedData.map((category) => category.slug)).toEqual([
      'trekking-expeditions',
      'adventure-trips',
      'cultural-heritage-tour',
      'nature-wildlife',
      'spiritual-pilgrimage',
      'short-hikes-day-trips',
      'remote-nepal-expeditions',
      'custom-private-trips',
    ])
  })
})
