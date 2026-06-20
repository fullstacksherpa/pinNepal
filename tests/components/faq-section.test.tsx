import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { FAQSectionContent, loadFAQItems } from '../../src/components/FAQSection'

describe('FAQ section', () => {
  it('renders published FAQ items in a shadcn accordion section', () => {
    const markup = renderToStaticMarkup(
      <FAQSectionContent
        faqs={[
          {
            id: 1,
            question: 'When is the best time to visit Nepal?',
            answer: 'Spring and autumn usually bring clearer skies for trekking and touring.',
          },
          {
            id: 2,
            question: 'Can PinNepal help with permits?',
            answer: 'Yes, package teams can help organize route permits when they are required.',
          },
        ]}
      />,
    )

    expect(markup).toContain('Trip questions, answered')
    expect(markup).toContain('When is the best time to visit Nepal?')
    expect(markup).toContain('Spring and autumn usually bring clearer skies')
    expect(markup).toContain('data-orientation="vertical"')
    expect(markup).toContain('aria-expanded="true"')
  })

  it('does not render an empty FAQ section', () => {
    const markup = renderToStaticMarkup(<FAQSectionContent faqs={[]} />)

    expect(markup).toBe('')
  })

  it('returns no FAQ items when the FAQ migration has not been applied yet', async () => {
    const cause = Object.assign(new Error('relation "faqs" does not exist'), { code: '42P01' })
    const payload = {
      find: async () => {
        throw Object.assign(new Error('Failed query'), { cause })
      },
    }

    await expect(loadFAQItems(payload)).resolves.toEqual([])
  })
})
