const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,

  exclude: [
    '/blog-sitemap.xml',
    '/blogs-sitemap.xml',
    '/destinations-sitemap.xml',
    '/tour-packages-sitemap.xml',
    '/admin',
    '/admin/*',
    '/api/*',
    '/next/preview',
    '/next/exit-preview',
  ],

  // THIS is what was missing — top-level, not inside robotsTxtOptions
  additionalSitemaps: [
    `${SITE_URL}/blog-sitemap.xml`,
    `${SITE_URL}/destinations-sitemap.xml`,
    `${SITE_URL}/tour-packages-sitemap.xml`,
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*', '/next/preview', '/next/exit-preview'],
      },
    ],
    // Keep here too so robots.txt also references them
    additionalSitemaps: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/blog-sitemap.xml`,
      `${SITE_URL}/destinations-sitemap.xml`,
      `${SITE_URL}/tour-packages-sitemap.xml`,
    ],
  },
}
