import type { Access, CollectionConfig, Field, Where } from 'payload'

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

import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { admins, adminsOrEditors } from '../../access/roles'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateTourPackage } from './hooks/revalidateTourPackage'
import { slugField } from 'payload'

const activePublishedConstraints: Where[] = [
  {
    _status: {
      equals: 'published',
    },
  },
  {
    availabilityStatus: {
      equals: 'active',
    },
  },
]

const authenticatedOrActivePublished: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    and: activePublishedConstraints,
  }
}

const tourPackageEditor = lexicalEditor({
  features: ({ rootFeatures }) => {
    return [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
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

const activityFields: Field[] = [
  {
    name: 'type',
    type: 'select',
    options: ['hiking', 'biking', 'kayaking', 'walking', 'cruise', 'driving', 'other'],
  },
  {
    name: 'durationHoursMin',
    label: 'Duration (min hrs)',
    type: 'number',
  },
  {
    name: 'durationHoursMax',
    label: 'Duration (max hrs)',
    type: 'number',
  },
  {
    name: 'distanceKm',
    label: 'Distance (km)',
    type: 'number',
  },
  {
    name: 'elevationGainM',
    label: 'Elevation gain (m)',
    type: 'number',
  },
  {
    name: 'elevationLossM',
    label: 'Elevation loss (m)',
    type: 'number',
  },
]

const mealFields: Field[] = [
  { name: 'breakfast', type: 'checkbox', defaultValue: false },
  { name: 'lunch', type: 'checkbox', defaultValue: false },
  { name: 'dinner', type: 'checkbox', defaultValue: false },
]

const difficultyOptions = [
  { label: 'Easy', value: 'EASY' },
  { label: 'Easy - Moderate', value: 'EASY_MODERATE' },
  { label: 'Moderate', value: 'MODERATE' },
  { label: 'Moderate - Challenging', value: 'MODERATE_CHALLENGING' },
  { label: 'Challenging', value: 'CHALLENGING' },
  { label: 'Extreme', value: 'EXTREME' },
]

const dayOptionFields: Field[] = [
  {
    name: 'optionId',
    label: 'Option ID',
    type: 'text',
    required: true,
    admin: {
      placeholder: 'comfort / challenging / private',
    },
  },
  {
    name: 'optionLabel',
    label: 'Short label',
    type: 'text',
    admin: {
      placeholder: 'Comfort option',
    },
  },
  {
    name: 'optionTitle',
    label: 'Full title',
    type: 'text',
    admin: {
      placeholder: 'Lodge-based route',
    },
  },
  {
    name: 'difficultyLevel',
    label: 'Difficulty',
    type: 'select',
    options: difficultyOptions,
  },
  {
    name: 'description',
    type: 'textarea',
  },
  {
    name: 'accommodation',
    type: 'text',
    admin: {
      placeholder: 'Himalayan Lodge, Namche Bazaar',
    },
  },
  {
    name: 'activity',
    type: 'group',
    fields: activityFields,
  },
]

export const TourPackages: CollectionConfig = {
  slug: 'tour-packages',
  dbName: 'tour_pkgs',
  labels: {
    singular: 'Tour Package',
    plural: 'Tour Packages',
  },
  access: {
    admin: adminsOrEditors,
    create: adminsOrEditors,
    delete: admins,
    read: authenticatedOrActivePublished,
    update: adminsOrEditors,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    tagline: true,
    coverImage: true,
    difficultyLevel: true,
    totalDays: true,
    pricePerPerson: true,
    currency: true,
    seo: {
      metaTitle: true,
      metaDescription: true,
    },
  },
  admin: {
    defaultColumns: [
      'title',
      'difficultyLevel',
      'totalDays',
      'pricePerPerson',
      'availabilityStatus',
      'updatedAt',
    ],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'tour-packages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'tour-packages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      useAsSlug: 'title',
    }),
    {
      name: 'tagline',
      type: 'text',
      admin: {
        placeholder: 'A short hook shown on cards and the hero.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: tourPackageEditor,
      admin: {
        description: 'Long-form introduction shown near the top of the package detail page.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'startLocation',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Kathmandu',
      },
    },
    {
      name: 'endLocation',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Kathmandu',
      },
    },
    {
      name: 'totalDays',
      type: 'number',
      required: true,
      admin: {
        description: 'Total trip length including arrival and departure days.',
      },
    },
    {
      name: 'totalNights',
      type: 'number',
    },
    {
      name: 'averageGroupSize',
      type: 'number',
      admin: {
        description: 'Typical number of guests per departure.',
      },
    },
    {
      name: 'minGroupSize',
      type: 'number',
    },
    {
      name: 'maxGroupSize',
      type: 'number',
    },
    {
      name: 'difficultyLevel',
      type: 'select',
      required: true,
      options: difficultyOptions,
    },
    {
      name: 'difficultyLabel',
      type: 'text',
      admin: {
        placeholder: 'Level 4 - shown verbatim on the page.',
      },
    },
    {
      name: 'difficultyDescription',
      type: 'textarea',
      admin: {
        placeholder: 'Solid fitness recommended. Hikes 3-6 hrs/day.',
      },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'NPR',
      options: [
        { label: 'NPR - Nepalese Rupee', value: 'NPR' },
        { label: 'USD - US Dollar', value: 'USD' },
        { label: 'EUR - Euro', value: 'EUR' },
        { label: 'GBP - British Pound', value: 'GBP' },
        { label: 'AUD - Australian Dollar', value: 'AUD' },
        { label: 'NZD - New Zealand Dollar', value: 'NZD' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'pricePerPerson',
      type: 'number',
      required: true,
      admin: {
        description: 'Base price per person in the selected currency.',
        position: 'sidebar',
      },
    },
    {
      name: 'taxesIncluded',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'singleSupplement',
      type: 'number',
      admin: {
        description: 'Extra cost for single-occupancy rooms.',
        position: 'sidebar',
      },
    },
    {
      name: 'depositAmount',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'whatsappNumber',
      label: 'WhatsApp number',
      type: 'text',
      admin: {
        description: 'Include country code. Used for the Chat to book button.',
        placeholder: '+977 98XXXXXXXX',
        position: 'sidebar',
      },
    },
    {
      name: 'whatsappPrefillMessage',
      label: 'WhatsApp prefill message',
      type: 'textarea',
      admin: {
        placeholder: "Hi, I'm interested in...",
        position: 'sidebar',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      admin: {
        description: 'Average rating out of 5.',
      },
    },
    {
      name: 'reviewCount',
      type: 'number',
    },
    {
      name: 'tripHighlights',
      label: 'Trip highlights',
      type: 'array',
      admin: {
        description: 'Popular places and activities shown in the highlights grid.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          options: [
            'hiking',
            'biking',
            'kayaking',
            'walking',
            'cruise',
            'cultural',
            'wildlife',
            'other',
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'shortDescription',
          type: 'textarea',
          admin: {
            placeholder: 'One or two sentences shown on the highlight card.',
          },
        },
      ],
    },
    {
      name: 'itinerary',
      type: 'array',
      admin: {
        description: 'Day-by-day plan. Enable options for days with variants.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'day',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'highlights',
          type: 'array',
          admin: {
            description: 'Short bullet highlights for this day.',
          },
          fields: [
            {
              name: 'highlight',
              type: 'text',
            },
          ],
        },
        {
          name: 'accommodation',
          type: 'text',
          admin: {
            placeholder: 'Himalayan Lodge, Namche Bazaar',
          },
        },
        {
          name: 'meals',
          type: 'group',
          fields: mealFields,
        },
        {
          name: 'activity',
          type: 'group',
          fields: activityFields,
        },
        {
          name: 'isFreeDay',
          label: 'Free day?',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Shows optional activities instead of core activity stats.',
          },
        },
        {
          name: 'optionalActivities',
          label: 'Optional activities',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.isFreeDay === true,
          },
          fields: [
            {
              name: 'activity',
              type: 'text',
            },
          ],
        },
        {
          name: 'hasOptions',
          label: 'Has difficulty options?',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable when guests choose between variants.',
          },
        },
        {
          name: 'options',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.hasOptions === true,
            description: 'Define each variant: comfort, challenging, private, etc.',
          },
          fields: dayOptionFields,
        },
      ],
    },
    {
      name: 'inclusions',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'exclusions',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'licencesAndPermits',
      label: 'Licences & permits',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'issuedBy',
          label: 'Issued by',
          type: 'text',
        },
        {
          name: 'includedInPrice',
          label: 'Included in price?',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'faqs',
      label: 'FAQs',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          options: [
            'logistics',
            'fitness',
            'accommodation',
            'activity',
            'guides',
            'booking',
            'preparation',
            'other',
          ],
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'districts',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'tour-package-categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedPackages',
      type: 'relationship',
      relationTo: 'tour-packages',
      hasMany: true,
      admin: {
        description: 'Show similar trips at the bottom of this package page.',
        position: 'sidebar',
      },
    },
    {
      name: 'availabilityStatus',
      label: 'Availability status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
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
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateTourPackage],
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
