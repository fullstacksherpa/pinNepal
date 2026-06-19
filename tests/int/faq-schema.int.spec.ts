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

describe('FAQ schema', () => {
  it('registers a standalone FAQ collection', async () => {
    const payloadConfig = await config
    const collectionSlugs = payloadConfig.collections.map((collection) => collection.slug)

    expect(collectionSlugs).toContain('faqs')
  })

  it('defines required question and answer fields for editorial FAQs', async () => {
    const payloadConfig = await config
    const faqs = payloadConfig.collections.find((collection) => collection.slug === 'faqs')
    const fieldNames = faqs ? collectFieldNames(faqs.fields) : []

    expect(fieldNames).toEqual(expect.arrayContaining(['question', 'answer', 'sortOrder']))

    const question = faqs?.fields.find((field) => 'name' in field && field.name === 'question') as
      | { required?: boolean; type?: string }
      | undefined
    const answer = faqs?.fields.find((field) => 'name' in field && field.name === 'answer') as
      | { required?: boolean; type?: string }
      | undefined

    expect(question).toMatchObject({ required: true, type: 'text' })
    expect(answer).toMatchObject({ required: true, type: 'textarea' })
  })
})
