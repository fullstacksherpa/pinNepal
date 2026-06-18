export type NavItem = {
  label: string
  href: string
}

export const headerNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Stories', href: '/blogs' },
  { label: 'Search', href: '/search' },
]

export const footerNavItems: NavItem[] = headerNavItems
