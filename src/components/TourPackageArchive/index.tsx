import type { TourPackageCardData } from '@/components/TourPackageCard'

import { TourPackageCard } from '@/components/TourPackageCard'
import React from 'react'

export const TourPackageArchive: React.FC<{
  tourPackages: TourPackageCardData[]
}> = ({ tourPackages }) => {
  return (
    <div className="container">
      <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8">
        {tourPackages?.map((tourPackage) => {
          if (typeof tourPackage !== 'object' || tourPackage === null) return null

          return (
            <div className="col-span-4" key={tourPackage.id || tourPackage.slug}>
              <TourPackageCard showCategories tourPackage={tourPackage} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
