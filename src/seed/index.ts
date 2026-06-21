import 'dotenv/config'

import configPromise from '../payload.config'
import { getPayload } from 'payload'
import { blogCategorySeedData } from './blogCategories'
import {
  destinationCategorySeedData,
  districtSeedData,
  provinceSeedData,
} from './destinationGeography'
import { seedTourPackageCategories } from './tourPackageCategories'

const adminUser = {
  email: 'og@gmail.com',
  password: 'khel',
  roles: ['admin'] as ('admin' | 'editor')[],
}

const seedAdminUser = async () => {
  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    pagination: false,
    where: {
      email: {
        equals: adminUser.email,
      },
    },
  })

  const existingUser = existing.docs[0]

  if (existingUser) {
    await payload.update({
      collection: 'users',
      id: existingUser.id,
      data: adminUser,
    })
    return
  }

  await payload.create({
    collection: 'users',
    data: adminUser,
  })
}

const seedBlogCategories = async () => {
  const payload = await getPayload({ config: configPromise })

  for (const category of blogCategorySeedData) {
    const existing = await payload.find({
      collection: 'blog-categories',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: category.slug,
        },
      },
    })

    const data = {
      title: category.title,
      slug: category.slug,
      description: '',
      metaTitle: category.title,
      metaDescription: '',
      image: null,
    }

    const existingCategory = existing.docs[0]

    if (existingCategory) {
      await payload.update({
        collection: 'blog-categories',
        context: {
          disableRevalidate: true,
        },
        id: existingCategory.id,
        data,
      })
      continue
    }

    await payload.create({
      collection: 'blog-categories',
      context: {
        disableRevalidate: true,
      },
      data,
    })
  }
}

const seedDestinationGeography = async () => {
  const payload = await getPayload({ config: configPromise })
  const provinceIDsBySlug = new Map<string, number>()

  for (const province of provinceSeedData) {
    const existing = await payload.find({
      collection: 'provinces',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: province.slug,
        },
      },
    })

    const existingProvince = existing.docs[0]
    const data = {
      name: province.name,
      slug: province.slug,
    }

    if (existingProvince) {
      const updated = await payload.update({
        collection: 'provinces',
        id: existingProvince.id,
        data,
      })
      provinceIDsBySlug.set(province.slug, updated.id)
      continue
    }

    const created = await payload.create({
      collection: 'provinces',
      data,
    })

    provinceIDsBySlug.set(province.slug, created.id)
  }

  for (const district of districtSeedData) {
    const provinceID = provinceIDsBySlug.get(district.provinceSlug)

    if (!provinceID) {
      throw new Error(`Missing province for district seed: ${district.name}`)
    }

    const existing = await payload.find({
      collection: 'districts',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: district.slug,
        },
      },
    })

    const data = {
      name: district.name,
      province: provinceID,
      slug: district.slug,
    }

    const existingDistrict = existing.docs[0]

    if (existingDistrict) {
      await payload.update({
        collection: 'districts',
        id: existingDistrict.id,
        data,
      })
      continue
    }

    await payload.create({
      collection: 'districts',
      data,
    })
  }

  for (const category of destinationCategorySeedData) {
    const existing = await payload.find({
      collection: 'destination-categories',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: category.slug,
        },
      },
    })

    const data = {
      title: category.title,
      slug: category.slug,
    }

    const existingCategory = existing.docs[0]

    if (existingCategory) {
      await payload.update({
        collection: 'destination-categories',
        context: {
          disableRevalidate: true,
        },
        id: existingCategory.id,
        data,
      })
      continue
    }

    await payload.create({
      collection: 'destination-categories',
      context: {
        disableRevalidate: true,
      },
      data,
    })
  }
}

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  await seedAdminUser()
  await seedBlogCategories()
  await seedDestinationGeography()
  await seedTourPackageCategories(payload)
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
