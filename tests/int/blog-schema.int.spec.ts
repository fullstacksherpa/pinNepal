import 'dotenv/config'

import { describe, expect, it } from 'vitest'
import config from '../../src/payload.config'
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

describe('blog schema', () => {
  it('registers the fresh blog collections and removes the template post collections', async () => {
    const payloadConfig = await config
    const collectionSlugs = payloadConfig.collections.map((collection) => collection.slug)

    expect(collectionSlugs).toContain('blogs')
    expect(collectionSlugs).toContain('blog-categories')
    expect(collectionSlugs).toContain('media')
    expect(collectionSlugs).toContain('users')
    expect(collectionSlugs).not.toContain('posts')
    expect(collectionSlugs).not.toContain('categories')
  })

  it('defines blog categories with the requested editorial and SEO fields', async () => {
    const payloadConfig = await config
    const blogCategories = payloadConfig.collections.find(
      (collection) => collection.slug === 'blog-categories',
    )

    expect(blogCategories).toBeDefined()

    const fieldNames = blogCategories ? collectFieldNames(blogCategories.fields) : []

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        'title',
        'slug',
        'description',
        'image',
        'metaTitle',
        'metaDescription',
      ]),
    )
  })

  it('defines user roles and author profile fields', async () => {
    const payloadConfig = await config
    const users = payloadConfig.collections.find((collection) => collection.slug === 'users')

    expect(users).toBeDefined()

    const fieldNames = users ? collectFieldNames(users.fields) : []

    expect(fieldNames).toEqual(expect.arrayContaining(['name', 'title', 'image', 'roles']))

    const rolesField = users?.fields.find(
      (field) => 'name' in field && field.name === 'roles',
    ) as { defaultValue?: unknown; hasMany?: boolean; required?: boolean; saveToJWT?: boolean }

    expect(rolesField).toMatchObject({
      defaultValue: ['editor'],
      hasMany: true,
      required: true,
      saveToJWT: true,
    })
  })
})
