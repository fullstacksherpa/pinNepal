import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { admins, adminsOrEditors } from '../../access/roles'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateDestination } from './hooks/revalidateDestination'
import { slugField } from 'payload'

const destinationEditor = lexicalEditor({
  features: ({ rootFeatures }) => {
    return [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      OrderedListFeature(),
      UnorderedListFeature(),
      IndentFeature(),
      BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      HorizontalRuleFeature(),
    ]
  },
})

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  labels: {
    singular: 'Destination',
    plural: 'Destinations',
  },
  access: {
    admin: adminsOrEditors,
    create: adminsOrEditors,
    delete: admins,
    read: authenticatedOrPublished,
    update: adminsOrEditors,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    summary: true,
    heroImage: true,
    district: true,
    categories: true,
    seo: {
      metaTitle: true,
      metaDescription: true,
    },
  },
  admin: {
    defaultColumns: ['name', 'district', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'destinations',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'destinations',
        req,
      }),
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
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: destinationEditor,
    },
    {
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'destination-categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'bestTimeToVisit',
      type: 'select',
      hasMany: true,
      options: ['Spring', 'Summer/Monsoon', 'Autumn', 'Winter'],
    },
    {
      name: 'recommendedDuration',
      type: 'text',
      admin: {
        placeholder: 'e.g., 3-5 days',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      options: ['Easy', 'Moderate', 'Hard', 'Strenuous'],
    },
    {
      name: 'altitude',
      type: 'number',
      admin: {
        description: 'Highest elevation in meters',
      },
    },
    {
      name: 'location',
      type: 'point',
    },
    {
      name: 'thingsToDo',
      type: 'array',
      fields: [
        {
          name: 'activity',
          type: 'text',
        },
      ],
    },
    {
      name: 'howToGetThere',
      type: 'richText',
      editor: destinationEditor,
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateDestination],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
