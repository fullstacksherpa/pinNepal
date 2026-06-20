import { afterEach, describe, expect, it, vi } from 'vitest'

describe('FAQ revalidation hooks', () => {
  afterEach(() => {
    vi.doUnmock('next/cache')
    vi.resetModules()
  })

  it('invalidates the FAQ cache tag after editorial changes and deletes', async () => {
    const revalidateTag = vi.fn()

    vi.doMock('next/cache', () => ({
      revalidatePath: vi.fn(),
      revalidateTag,
      unstable_cache: vi.fn((fetchData) => fetchData),
    }))

    const { FAQs } = await import('../../src/collections/FAQs')
    const afterChange = FAQs.hooks?.afterChange?.[0]
    const afterDelete = FAQs.hooks?.afterDelete?.[0]
    const doc = { id: 1, question: 'Do I need permits?', _status: 'published' }
    const req = {
      context: {},
      payload: {
        logger: {
          info: vi.fn(),
        },
      },
    }

    expect(afterChange).toBeDefined()
    expect(afterDelete).toBeDefined()
    expect(await afterChange?.({ doc, req } as never)).toBe(doc)
    expect(await afterDelete?.({ doc, req } as never)).toBe(doc)
    expect(revalidateTag).toHaveBeenCalledTimes(2)
    expect(revalidateTag).toHaveBeenCalledWith('faqs', 'max')
  })
})
