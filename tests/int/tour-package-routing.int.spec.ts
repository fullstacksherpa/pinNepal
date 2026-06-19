import 'dotenv/config'

import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'
import { randomUUID } from 'node:crypto'

import config from '../../src/payload.config'
import {
  queryTourPackageCategoryBySlug,
  queryTourPackages,
  queryTourPackagesByCategory,
} from '../../src/app/(frontend)/tour-packages/category/[categorySlug]/queries'

let payload: Payload
let createdCategoryID: number | null = null
const packageIDs: number[] = []

describe('tour package routing', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  }, 120000)

  afterEach(async () => {
    while (packageIDs.length > 0) {
      const id = packageIDs.pop()

      if (id) {
        await payload.delete({
          collection: 'tour-packages',
          context: {
            disableRevalidate: true,
          },
          id,
        })
      }
    }

    if (createdCategoryID) {
      await payload.delete({
        collection: 'tour-package-categories',
        id: createdCategoryID,
      })
      createdCategoryID = null
    }
  })

  it('queries active published packages by package category slug', async () => {
    const suffix = randomUUID()
    const existingCategory = await payload.find({
      collection: 'tour-package-categories',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'trekking-expeditions',
        },
      },
    })

    if (!existingCategory.docs[0]) {
      const createdCategory = await payload.create({
        collection: 'tour-package-categories',
        data: {
          slug: 'trekking-expeditions',
          title: 'Trekking & Expeditions',
        },
      })

      createdCategoryID = createdCategory.id
    }

    const category = await queryTourPackageCategoryBySlug('trekking-expeditions')

    expect(category?.slug).toBe('trekking-expeditions')

    const districts = await payload.find({
      collection: 'districts',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'solukhumbu',
        },
      },
    })

    const region = districts.docs[0]

    expect(region).toBeDefined()

    const media = await payload.find({
      collection: 'media',
      limit: 1,
      pagination: false,
    })
    const coverImage = media.docs[0]

    expect(coverImage).toBeDefined()

    const visiblePackage = await payload.create({
      collection: 'tour-packages',
      context: {
        disableRevalidate: true,
      },
      data: {
        _status: 'published',
        availabilityStatus: 'active',
        categories: category ? [category.id] : [],
        coverImage: coverImage.id,
        currency: 'NPR',
        difficultyLevel: 'MODERATE',
        endLocation: 'Kathmandu',
        pricePerPerson: 125000,
        region: region.id,
        slug: `vitest-active-package-${suffix}`,
        startLocation: 'Kathmandu',
        tagline: 'Temporary package used for category routing tests.',
        title: `Vitest Active Package ${suffix}`,
        totalDays: 12,
      },
    })
    packageIDs.push(visiblePackage.id)

    const archivedPackage = await payload.create({
      collection: 'tour-packages',
      context: {
        disableRevalidate: true,
      },
      data: {
        _status: 'published',
        availabilityStatus: 'archived',
        categories: category ? [category.id] : [],
        coverImage: coverImage.id,
        currency: 'NPR',
        difficultyLevel: 'MODERATE',
        endLocation: 'Kathmandu',
        pricePerPerson: 125000,
        region: region.id,
        slug: `vitest-archived-package-${suffix}`,
        startLocation: 'Kathmandu',
        tagline: 'Archived package should not appear publicly.',
        title: `Vitest Archived Package ${suffix}`,
        totalDays: 12,
      },
    })
    packageIDs.push(archivedPackage.id)

    const packagesByCategory = await queryTourPackagesByCategory({
      categoryID: category?.id || 0,
      page: 1,
    })
    const packageArchive = await queryTourPackages({ page: 1 })

    expect(packagesByCategory.docs.map((doc) => doc.id)).toContain(visiblePackage.id)
    expect(packagesByCategory.docs.map((doc) => doc.id)).not.toContain(archivedPackage.id)
    expect(packageArchive.docs.map((doc) => doc.id)).toContain(visiblePackage.id)
    expect(packageArchive.docs.map((doc) => doc.id)).not.toContain(archivedPackage.id)
  }, 120000)
})
