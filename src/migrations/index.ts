import * as migration_20260618_181927_fresh_blog_baseline from './20260618_181927_fresh_blog_baseline'
import * as migration_20260618_211639_user_rbac_author_profiles from './20260618_211639_user_rbac_author_profiles'

export const migrations = [
  {
    up: migration_20260618_181927_fresh_blog_baseline.up,
    down: migration_20260618_181927_fresh_blog_baseline.down,
    name: '20260618_181927_fresh_blog_baseline',
  },
  {
    up: migration_20260618_211639_user_rbac_author_profiles.up,
    down: migration_20260618_211639_user_rbac_author_profiles.down,
    name: '20260618_211639_user_rbac_author_profiles',
  },
]
