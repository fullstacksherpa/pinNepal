import * as migration_20260618_181927_fresh_blog_baseline from './20260618_181927_fresh_blog_baseline'
import * as migration_20260618_211639_user_rbac_author_profiles from './20260618_211639_user_rbac_author_profiles'
import * as migration_20260619_010211_destination_geography_taxonomy from './20260619_010211_destination_geography_taxonomy'
import * as migration_20260619_044744_tour_packages from './20260619_044744_tour_packages'
import * as migration_20260619_204351_faqs from './20260619_204351_faqs'

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
  {
    up: migration_20260619_010211_destination_geography_taxonomy.up,
    down: migration_20260619_010211_destination_geography_taxonomy.down,
    name: '20260619_010211_destination_geography_taxonomy',
  },
  {
    up: migration_20260619_044744_tour_packages.up,
    down: migration_20260619_044744_tour_packages.down,
    name: '20260619_044744_tour_packages',
  },
  {
    up: migration_20260619_204351_faqs.up,
    down: migration_20260619_204351_faqs.down,
    name: '20260619_204351_faqs',
  },
]
