import type { Payload } from 'payload'

export const tourPackageCategorySeedData = [
  { title: 'Trekking & Expeditions', slug: 'trekking-expeditions' },
  { title: 'Adventure Trips', slug: 'adventure-trips' },
  { title: 'Cultural & Heritage Tour', slug: 'cultural-heritage-tour' },
  { title: 'Nature & Wildlife', slug: 'nature-wildlife' },
  { title: 'Spiritual & Pilgrimage', slug: 'spiritual-pilgrimage' },
  { title: 'Short Hikes & Day Trips', slug: 'short-hikes-day-trips' },
  { title: 'Remote Nepal Expeditions', slug: 'remote-nepal-expeditions' },
  { title: 'Custom Private Trips', slug: 'custom-private-trips' },
] as const

export const seedTourPackageCategories = async (payload: Payload) => {
  for (const category of tourPackageCategorySeedData) {
    const existing = await payload.find({
      collection: 'tour-package-categories',
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
        collection: 'tour-package-categories',
        context: {
          disableRevalidate: true,
        },
        id: existingCategory.id,
        data,
      })
      continue
    }

    await payload.create({
      collection: 'tour-package-categories',
      context: {
        disableRevalidate: true,
      },
      data,
    })
  }
}
