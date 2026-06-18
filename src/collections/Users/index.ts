import type { CollectionConfig } from 'payload'

import { admins, adminsField, adminsOrEditors, adminsOrSelf } from '../../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: adminsOrEditors,
    create: admins,
    delete: admins,
    read: adminsOrSelf,
    update: adminsOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'title', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Profile image',
      relationTo: 'media',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminsField,
        read: adminsField,
        update: adminsField,
      },
      defaultValue: ['editor'],
      hasMany: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
      required: true,
      saveToJWT: true,
    },
  ],
  timestamps: true,
}
