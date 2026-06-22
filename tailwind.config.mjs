/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--pn-body)',
              '--tw-prose-headings': 'var(--pn-navy)',
              '--tw-prose-lead': 'var(--pn-navy)',
              '--tw-prose-links': 'var(--pn-sage)',
              '--tw-prose-bold': 'var(--pn-navy)',
              '--tw-prose-counters': 'var(--pn-orange)',
              '--tw-prose-bullets': 'var(--pn-orange)',
              '--tw-prose-hr': 'var(--pn-border)',
              '--tw-prose-quotes': 'var(--pn-navy)',
              '--tw-prose-quote-borders': 'var(--pn-orange)',
              '--tw-prose-captions': 'var(--pn-mist)',
              '--tw-prose-code': 'var(--pn-navy)',
              fontFamily: 'var(--font-body)',
              h1: {
                color: 'var(--pn-navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0',
                lineHeight: 1.08,
                marginBottom: '0.25em',
              },
              h2: {
                color: 'var(--pn-navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0',
              },
              h3: {
                color: 'var(--pn-navy)',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                letterSpacing: '0',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
