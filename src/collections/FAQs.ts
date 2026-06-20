import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { admins, adminsOrEditors } from '@/access/roles'
import { revalidateFAQs, revalidateFAQsDelete } from './FAQs/hooks/revalidateFAQs'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  access: {
    create: adminsOrEditors,
    delete: admins,
    read: authenticatedOrPublished,
    update: adminsOrEditors,
  },
  admin: {
    defaultColumns: ['question', 'sortOrder', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'question',
  },
  defaultPopulate: {
    question: true,
    answer: true,
    sortOrder: true,
  },
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [revalidateFAQs],
    afterDelete: [revalidateFAQsDelete],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      index: true,
      maxLength: 180,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sortOrder',
      label: 'Sort order',
      type: 'number',
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  versions: {
    drafts: {
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
}
