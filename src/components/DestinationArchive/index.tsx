import type { DestinationCardData } from '@/components/DestinationCard'

import { DestinationCard } from '@/components/DestinationCard'
import React from 'react'

export const DestinationArchive: React.FC<{
  destinations: DestinationCardData[]
}> = ({ destinations }) => {
  return (
    <div className="container">
      <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8">
        {destinations?.map((destination) => {
          if (typeof destination !== 'object' || destination === null) return null

          return (
            <div className="col-span-4" key={destination.id || destination.slug}>
              <DestinationCard destination={destination} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
