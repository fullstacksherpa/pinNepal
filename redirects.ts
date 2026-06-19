import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const legacyBlogsRedirect = {
    destination: '/blog/:path*',
    permanent: true,
    source: '/blogs/:path*',
  }

  const legacyBlogsSitemapRedirect = {
    destination: '/blog-sitemap.xml',
    permanent: true,
    source: '/blogs-sitemap.xml',
  }

  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  return [legacyBlogsRedirect, legacyBlogsSitemapRedirect, internetExplorerRedirect]
}
