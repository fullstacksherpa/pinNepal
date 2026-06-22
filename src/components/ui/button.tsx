import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-btn)] text-sm font-semibold uppercase tracking-[0.04em] transition-[background-color,color,box-shadow,border-color] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
  {
    variants: {
      variant: {
        default: 'bg-[var(--pn-sage)] text-white shadow-sm hover:bg-[var(--pn-sage-dark)]',
        destructive: 'bg-[var(--pn-red)] text-white shadow-xs hover:bg-[#a93226]',
        outline:
          'border-2 border-[var(--pn-navy)] bg-transparent text-[var(--pn-navy)] shadow-xs hover:bg-[var(--pn-navy)] hover:text-white',
        secondary: 'bg-[var(--pn-navy)] text-white shadow-xs hover:bg-[#182750]',
        ghost: 'text-[var(--pn-sage)] hover:bg-[var(--pn-sage-light)] hover:text-[var(--pn-sage-dark)]',
        link: 'text-[var(--pn-sage)] underline-offset-4 hover:underline',
      },
      size: {
        clear: '',
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-[var(--radius-btn)] px-3 has-[>svg]:px-2.5',
        lg: 'h-11 rounded-[var(--radius-btn)] px-8 has-[>svg]:px-4',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
