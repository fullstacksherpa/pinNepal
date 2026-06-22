import React from 'react'

import type { Blog } from '@/payload-types'

import { Media } from '@/components/Media'

export const BlogHero: React.FC<{
  blog: Blog
}> = ({ blog }) => {
  const { heroImage, title } = blog

  return (
    <div className="relative flex items-end min-h-[80vh] -mt-[10.4rem]">
      {/* BACKGROUND IMAGE CONTAINER */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="object-cover" resource={heroImage} />
        )}

        {/* 1. ENHANCED GRADIENT: 
          - Increased height to h-3/4 so it covers more of the text area.
          - Made the bottom significantly darker (from-black/80).
          - Added a middle stop (via-black/30) so the fade feels smoother.
        */}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-3/4 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* FOREGROUND TEXT CONTAINER */}
      <div className="container relative z-10 pb-12 text-white lg:grid lg:grid-cols-[1fr_48rem_1fr]">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          {/* 2. TEXT SHADOW: 
            - Added drop-shadow-2xl to give the text physical separation from the image.
            - Added font-bold (if not already handled in your global styles) to give the text more weight.
          */}
          <h1 className="mb-6 text-4xl tracking-wider md:text-5xl lg:text-6xl drop-shadow-2xl font-bold">
            {title}
          </h1>
        </div>
      </div>
    </div>
  )
}
