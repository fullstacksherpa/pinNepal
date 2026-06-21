import type { NextRequest } from 'next/server'

import { isRevalidationContentType, revalidateByContentType } from '@/utilities/revalidateContent'
import { NextResponse } from 'next/server'

type RevalidationRequestBody = {
  slug?: unknown
  type?: unknown
}

const parseBody = async (req: NextRequest): Promise<RevalidationRequestBody | null> => {
  try {
    return (await req.json()) as RevalidationRequestBody
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET

  if (!configuredSecret) {
    return NextResponse.json({ error: 'Revalidation secret is not configured' }, { status: 500 })
  }

  if (req.headers.get('x-revalidate-secret') !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await parseBody(req)

  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isRevalidationContentType(body.type)) {
    return NextResponse.json({ error: 'Unsupported revalidation type' }, { status: 400 })
  }

  const slug = typeof body.slug === 'string' && body.slug.length > 0 ? body.slug : null

  revalidateByContentType(body.type, slug)

  return NextResponse.json({
    revalidated: true,
    slug,
    type: body.type,
  })
}
