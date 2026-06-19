import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { admins, adminsOrEditors } from '../access/roles'
import { slugField } from 'payload'

export const Districts: CollectionConfig = {
  slug: 'districts',
  labels: {
    singular: 'District',
    plural: 'Districts',
  },
  access: {
    admin: adminsOrEditors,
    create: adminsOrEditors,
    delete: admins,
    read: anyone,
    update: adminsOrEditors,
  },
  admin: {
    defaultColumns: ['name', 'province', 'slug', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({
      useAsSlug: 'name',
    }),
    {
      name: 'province',
      type: 'relationship',
      relationTo: 'provinces',
      required: true,
    },
  ],
}
