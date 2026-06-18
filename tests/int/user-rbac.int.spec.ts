import 'dotenv/config'

import { beforeAll, beforeEach, afterEach, describe, expect, it } from 'vitest'
import { getPayload, type Payload } from 'payload'

import config from '../../src/payload.config'

let payload: Payload

const emails = [
  'rbac-admin@pinnepal.test',
  'rbac-created-editor@pinnepal.test',
  'rbac-editor@pinnepal.test',
  'rbac-other-editor@pinnepal.test',
]

const cleanupUsers = async () => {
  for (const email of emails) {
    await payload.delete({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })
  }
}

const createUser = async ({
  email,
  name,
  roles,
}: {
  email: string
  name: string
  roles: ('admin' | 'editor')[]
}) => {
  return payload.create({
    collection: 'users',
    data: {
      email,
      name,
      password: 'testtest',
      roles,
    },
  })
}

describe('user RBAC', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  beforeEach(cleanupUsers)
  afterEach(cleanupUsers)

  it('allows admins to create users and update roles', async () => {
    const admin = await createUser({
      email: 'rbac-admin@pinnepal.test',
      name: 'RBAC Admin',
      roles: ['admin'],
    })

    const editor = await payload.create({
      collection: 'users',
      data: {
        email: 'rbac-created-editor@pinnepal.test',
        name: 'Created Editor',
        password: 'testtest',
        roles: ['editor'],
      },
      overrideAccess: false,
      user: admin,
    })

    expect(editor.roles).toEqual(['editor'])

    const promoted = await payload.update({
      collection: 'users',
      id: editor.id,
      data: {
        roles: ['admin'],
      },
      overrideAccess: false,
      user: admin,
    })

    expect(promoted.roles).toEqual(['admin'])
  })

  it('prevents editors from changing roles or other users', async () => {
    const editor = await createUser({
      email: 'rbac-editor@pinnepal.test',
      name: 'RBAC Editor',
      roles: ['editor'],
    })
    const otherEditor = await createUser({
      email: 'rbac-other-editor@pinnepal.test',
      name: 'Other Editor',
      roles: ['editor'],
    })

    await expect(
      payload.update({
        collection: 'users',
        id: otherEditor.id,
        data: {
          title: 'Changed by another editor',
        },
        overrideAccess: false,
        user: editor,
      }),
    ).rejects.toThrow()

    await payload.update({
      collection: 'users',
      id: editor.id,
      data: {
        roles: ['admin'],
      },
      overrideAccess: false,
      user: editor,
    })

    const unchangedEditor = await payload.findByID({
      collection: 'users',
      id: editor.id,
    })

    expect(unchangedEditor.roles).toEqual(['editor'])
  })

  it('allows editors to update their own profile fields', async () => {
    const editor = await createUser({
      email: 'rbac-editor@pinnepal.test',
      name: 'RBAC Editor',
      roles: ['editor'],
    })

    const updated = await payload.update({
      collection: 'users',
      id: editor.id,
      data: {
        image: null,
        name: 'Main Editor',
        title: 'Travel Editor',
      },
      overrideAccess: false,
      user: editor,
    })

    expect(updated.name).toBe('Main Editor')
    expect(updated.title).toBe('Travel Editor')
  })

  it('keeps published blog reads public', async () => {
    const blogs = await payload.find({
      collection: 'blogs',
      limit: 1,
      overrideAccess: false,
    })

    expect(Array.isArray(blogs.docs)).toBe(true)
  })
})
