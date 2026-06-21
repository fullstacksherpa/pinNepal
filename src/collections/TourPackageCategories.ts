import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { admins, adminsOrEditors } from '../access/roles'
import {
  revalidateTourPackageCategory,
  revalidateTourPackageCategoryDelete,
} from './TourPackageCategories/hooks/revalidateTourPackageCategory'
import { slugField } from 'payload'

export const TourPackageCategories: CollectionConfig = {
  slug: 'tour-package-categories',
  dbName: 'tour_pkg_cats',
  labels: {
    singular: 'Tour Package Category',
    plural: 'Tour Package Categories',
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
  hooks: {
    afterChange: [revalidateTourPackageCategory],
    afterDelete: [revalidateTourPackageCategoryDelete],
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
