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
    '/*',
    '/blog/*',
    '/blogs/*',
    '/destinations/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/blog-sitemap.xml`, `${SITE_URL}/destinations-sitemap.xml`],
  },
}
