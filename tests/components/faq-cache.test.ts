import { afterEach, describe, expect, it, vi } from 'vitest'

describe('FAQ cache wiring', () => {
  afterEach(() => {
    vi.doUnmock('next/cache')
    vi.resetModules()
  })

  it('wraps the Payload FAQ query in a permanent tagged Next cache', async () => {
    const unstableCache = vi.fn((fetchData) => fetchData)

    vi.doMock('next/cache', () => ({
      revalidatePath: vi.fn(),
      revalidateTag: vi.fn(),
      unstable_cache: unstableCache,
    }))

    await import('../../src/components/FAQSection')

    expect(unstableCache).toHaveBeenCalledWith(expect.any(Function), ['faq-cache-key'], {
      revalidate: false,
      tags: ['faqs'],
    })
  })
})
