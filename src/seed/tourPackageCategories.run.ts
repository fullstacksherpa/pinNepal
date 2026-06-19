import 'dotenv/config'

import configPromise from '../payload.config'
import { getPayload } from 'payload'
import { seedTourPackageCategories } from './tourPackageCategories'

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  await seedTourPackageCategories(payload)
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
