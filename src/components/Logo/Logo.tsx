import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      aria-label="PinNepal"
      className={cn('block text-xl font-semibold tracking-normal text-current', className)}
    >
      PinNepal
    </span>
  )
}
