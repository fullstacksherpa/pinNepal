import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

type Role = 'admin' | 'editor'
type RoleAccessArgs = {
  req: {
    user?: User | null
  }
}
type UserWithRoles = User & {
  roles?: Role[] | null
}

export const hasRole = (user: User | null | undefined, role: Role): boolean => {
  return Boolean((user as UserWithRoles | null | undefined)?.roles?.includes(role))
}

export const isAdmin = (user: User | null | undefined): boolean => hasRole(user, 'admin')

export const isEditor = (user: User | null | undefined): boolean => hasRole(user, 'editor')

export const admins = ({ req: { user } }: RoleAccessArgs): boolean => isAdmin(user)

export const adminsOrEditors = ({ req: { user } }: RoleAccessArgs): boolean => {
  return isAdmin(user) || isEditor(user)
}

export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true
  if (!isEditor(user)) return false

  return {
    id: {
      equals: user.id,
    },
  }
}

export const adminsField: FieldAccess = ({ req: { user } }) => isAdmin(user)
