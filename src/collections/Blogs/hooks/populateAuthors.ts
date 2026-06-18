import type { CollectionAfterReadHook } from 'payload'
import type { Media, User } from 'src/payload-types'

type AuthorUser = User & {
  image?: number | Media | null
  title?: string | null
}

export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    const authorDocs: AuthorUser[] = []

    for (const author of doc.authors) {
      try {
        const authorDoc = await payload.findByID({
          id: typeof author === 'object' ? author?.id : author,
          collection: 'users',
          depth: 1,
          select: {
            id: true,
            image: true,
            name: true,
            title: true,
          },
        }) as AuthorUser

        if (authorDoc) {
          authorDocs.push(authorDoc)
        }

        if (authorDocs.length > 0) {
          doc.populatedAuthors = authorDocs.map((authorDoc) => ({
            id: String(authorDoc.id),
            image: authorDoc.image,
            name: authorDoc.name,
            title: authorDoc.title,
          }))
        }
      } catch {
        // The public blog API should not fail just because an author was removed.
      }
    }
  }

  return doc
}
