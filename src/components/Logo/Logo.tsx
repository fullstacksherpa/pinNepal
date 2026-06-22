import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  compact?: boolean
  markClassName?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  variant?: 'dark' | 'light'
}

export const Logo = (props: Props) => {
  const { className, compact = false, markClassName, variant = 'dark' } = props
  const isLight = variant === 'light'

  return (
    <span
      aria-label="PinNepal"
      className={cn('inline-flex items-center gap-2.5 text-left leading-none', className)}
    >
      <svg
        aria-hidden="true"
        className={cn('size-10 shrink-0', compact && 'size-9', markClassName)}
        fill="none"
        viewBox="0 0 48 56"
      >
        <path
          d="M24 54C16.2 42.5 6 32.4 6 20.5C6 9.6 14.1 2 24 2s18 7.6 18 18.5C42 32.4 31.8 42.5 24 54Z"
          fill={isLight ? 'rgba(255,255,255,0.22)' : '#3D7A5A'}
        />
        <path
          d="M13 27.4L20.3 15.9l5.1 7.1l3.4-4.8l6.2 9.2H13Z"
          fill="#FFFFFF"
          opacity={isLight ? 0.92 : 1}
        />
        <path
          d="M22 29.4C26.8 32.6 28.7 36.3 25.1 42.9M25.1 42.9C23.8 45.4 23.5 47.6 24 50.1M25.1 42.9C21.9 39.3 18.7 37.8 15.2 37.5"
          stroke="#E8501A"
          strokeLinecap="round"
          strokeWidth="2.8"
        />
      </svg>
      <span className="grid gap-1">
        <span className="font-serif text-[1.42rem] font-bold tracking-normal md:text-[1.55rem]">
          <span className={isLight ? 'text-white' : 'text-[var(--pn-navy)]'}>Pin</span>
          <span className="text-[var(--pn-orange)]">Nepal</span>
        </span>
        {!compact && (
          <span
            className={cn(
              'font-mono text-[0.56rem] uppercase leading-none tracking-[0.24em]',
              isLight ? 'text-white/55' : 'text-[var(--pn-mist)]',
            )}
          >
            Travel & Adventure
          </span>
        )}
      </span>
    </span>
  )
}
