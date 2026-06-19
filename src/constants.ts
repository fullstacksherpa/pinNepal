export type NavItem = {
  label: string
  href: string
}

export const headerNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Tour Packages', href: '/tour-packages' },
  { label: 'Stories', href: '/blog' },
  { label: 'Search', href: '/search' },
]

export const footerNavItems: NavItem[] = headerNavItems
