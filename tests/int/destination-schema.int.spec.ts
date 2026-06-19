import 'dotenv/config'

import { describe, expect, it } from 'vitest'
import config from '../../src/payload.config'
import {
  destinationCategorySeedData,
  districtSeedData,
  provinceSeedData,
} from '../../src/seed/destinationGeography'
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

describe('destination schema', () => {
  it('registers destination collections with the existing core collections', async () => {
    const payloadConfig = await config
    const collectionSlugs = payloadConfig.collections.map((collection) => collection.slug)

    expect(collectionSlugs).toEqual(
      expect.arrayContaining([
        'blogs',
        'blog-categories',
        'destinations',
        'destination-categories',
        'districts',
        'provinces',
        'media',
        'users',
      ]),
    )
  })

  it('defines geography taxonomy fields', async () => {
    const payloadConfig = await config
    const provinces = payloadConfig.collections.find((collection) => collection.slug === 'provinces')
    const districts = payloadConfig.collections.find((collection) => collection.slug === 'districts')
    const destinationCategories = payloadConfig.collections.find(
      (collection) => collection.slug === 'destination-categories',
    )

    expect(provinces ? collectFieldNames(provinces.fields) : []).toEqual(
      expect.arrayContaining(['name', 'slug']),
    )
    expect(districts ? collectFieldNames(districts.fields) : []).toEqual(
      expect.arrayContaining(['name', 'slug', 'province']),
    )
    expect(destinationCategories ? collectFieldNames(destinationCategories.fields) : []).toEqual(
      expect.arrayContaining(['title', 'slug']),
    )
  })

  it('defines destination editorial, relationship, media, travel, and SEO fields', async () => {
    const payloadConfig = await config
    const destinations = payloadConfig.collections.find(
      (collection) => collection.slug === 'destinations',
    )

    expect(destinations).toBeDefined()

    const fieldNames = destinations ? collectFieldNames(destinations.fields) : []

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        'name',
        'slug',
        'summary',
        'content',
        'district',
        'categories',
        'heroImage',
        'gallery',
        'bestTimeToVisit',
        'recommendedDuration',
        'difficulty',
        'altitude',
        'location',
        'thingsToDo',
        'howToGetThere',
        'seo',
        'metaTitle',
        'metaDescription',
      ]),
    )
  })

  it('keeps the requested destination seed data complete', () => {
    expect(provinceSeedData).toHaveLength(7)
    expect(districtSeedData).toHaveLength(77)
    expect(destinationCategorySeedData).toHaveLength(5)
    expect(destinationCategorySeedData.map((category) => category.slug)).toEqual([
      'trekking-mountaineering',
      'wildlife-jungle-safaris',
      'culture-heritage',
      'leisure-relaxation',
      'adventures',
    ])
  })
})
