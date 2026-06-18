import 'dotenv/config'

import configPromise from '../payload.config'
import { getPayload } from 'payload'
import { blogCategorySeedData } from './blogCategories'

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
        id: existingCategory.id,
        data,
      })
      continue
    }

    await payload.create({
      collection: 'blog-categories',
      data,
    })
  }
}

const run = async () => {
  await seedAdminUser()
  await seedBlogCategories()
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
