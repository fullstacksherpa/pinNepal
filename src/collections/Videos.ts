import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Videos: CollectionConfig = {
  slug: 'videos',
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['video/*'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
