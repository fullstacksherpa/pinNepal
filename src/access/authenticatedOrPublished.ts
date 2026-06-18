import type { Access } from 'payload'

import { isAdmin, isEditor } from './roles'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (isAdmin(user) || isEditor(user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
