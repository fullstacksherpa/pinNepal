import 'dotenv/config'

import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import { randomUUID } from 'node:crypto'

import config from '../../src/payload.config'
import {
  queryDestinationCategoryBySlug,
  queryDestinationsByCategory,
} from '../../src/app/(frontend)/destinations/category/[categorySlug]/queries'

let payload: Payload
let destinationID: number | null = null

describe('destination routing', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterEach(async () => {
    if (destinationID) {
      await payload.delete({
        collection: 'destinations',
        context: {
          disableRevalidate: true,
        },
        id: destinationID,
      })
      destinationID = null
    }
  })

  it('queries destinations by destination category slug for category listing routes', async () => {
    const suffix = randomUUID()
    const category = await queryDestinationCategoryBySlug('trekking-mountaineering')

    expect(category?.slug).toBe('trekking-mountaineering')

    const districts = await payload.find({
      collection: 'districts',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'kathmandu',
        },
      },
    })

    const district = districts.docs[0]

    expect(district).toBeDefined()

    const media = await payload.find({
      collection: 'media',
      limit: 1,
      pagination: false,
    })
    const heroImage = media.docs[0]

    expect(heroImage).toBeDefined()

    const destination = await payload.create({
      collection: 'destinations',
      context: {
        disableRevalidate: true,
      },
      data: {
        _status: 'published',
        categories: category ? [category.id] : [],
        district: district.id,
        heroImage: heroImage.id,
        name: `Vitest Destination ${suffix}`,
        slug: `vitest-destination-${suffix}`,
        summary: 'Temporary destination used for category routing tests.',
      },
    })
    destinationID = destination.id

    const destinations = await queryDestinationsByCategory({
      categoryID: category?.id || 0,
      page: 1,
    })

    expect(destinations.docs.map((doc) => doc.id)).toContain(destination.id)
  })
})
