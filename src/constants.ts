export type NavItem = {
  description?: string
  label: string
  href: string
}

export const headerNavItems: NavItem[] = [
  { label: 'Destinations', href: '/destinations', description: 'Places by district and route' },
  { label: 'Tour Packages', href: '/tour-packages', description: 'Treks, rides, and tours' },
  { label: 'Blogs', href: '/blog', description: 'Route guides and field notes' },
]

export const mobileNavItems: NavItem[] = [
  { label: 'Home', href: '/', description: 'PinNepal overview' },
  ...headerNavItems,
  { label: 'Search', href: '/search', description: 'Find routes, places, and notes' },
]

export const footerNavGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Explore',
    items: [
      { label: 'Destinations', href: '/destinations' },
      { label: 'Destination categories', href: '/destinations/category' },
      { label: 'Search', href: '/search' },
    ],
  },
  {
    label: 'Packages',
    items: [
      { label: 'Tour packages', href: '/tour-packages' },
      { label: 'Package categories', href: '/tour-packages/category' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { label: 'Stories', href: '/blog' },
      { label: 'Story categories', href: '/blog/category' },
    ],
  },
]

export const footerNavItems: NavItem[] = mobileNavItems

export const FAQ_CACHE_KEY = 'faq-cache-key'
export const FAQ_CACHE_TAG = 'faqs'
export const FAQ_CACHE_REVALIDATE_PROFILE = 'max'
