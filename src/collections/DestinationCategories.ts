import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { admins, adminsOrEditors } from '../access/roles'
import { slugField } from 'payload'

export const DestinationCategories: CollectionConfig = {
  slug: 'destination-categories',
  labels: {
    singular: 'Destination Category',
    plural: 'Destination Categories',
  },
  access: {
    admin: adminsOrEditors,
    create: adminsOrEditors,
    delete: admins,
    read: anyone,
    update: adminsOrEditors,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
  ],
}
