import { revalidatePath, revalidateTag } from 'next/cache'

export type RevalidationContentType =
  | 'blog'
  | 'blog-category'
  | 'destination'
  | 'destination-category'
  | 'tour-package'
  | 'tour-package-category'

const REVALIDATION_CONTENT_TYPES = new Set<RevalidationContentType>([
  'blog',
  'blog-category',
  'destination',
  'destination-category',
  'tour-package',
  'tour-package-category',
])

type Slug = string | null | undefined

export const isRevalidationContentType = (type: unknown): type is RevalidationContentType => {
  return typeof type === 'string' && REVALIDATION_CONTENT_TYPES.has(type as RevalidationContentType)
}

const revalidateBlogArchives = () => {
  revalidatePath('/blog')
  revalidatePath('/blog/page/[pageNumber]', 'page')
}

const revalidateBlogCategoryArchives = () => {
  revalidatePath('/blog/category')
  revalidatePath('/blog/category/[categorySlug]', 'page')
  revalidatePath('/blog/category/[categorySlug]/page/[pageNumber]', 'page')
}

const revalidateDestinationArchives = () => {
  revalidatePath('/destinations')
  revalidatePath('/destinations/page/[pageNumber]', 'page')
}

const revalidateDestinationCategoryArchives = () => {
  revalidatePath('/destinations/category')
  revalidatePath('/destinations/category/[categorySlug]', 'page')
  revalidatePath('/destinations/category/[categorySlug]/page/[pageNumber]', 'page')
}

const revalidateTourPackageArchives = () => {
  revalidatePath('/tour-packages')
  revalidatePath('/tour-packages/page/[pageNumber]', 'page')
}

const revalidateTourPackageCategoryArchives = () => {
  revalidatePath('/tour-packages/category')
  revalidatePath('/tour-packages/category/[categorySlug]', 'page')
  revalidatePath('/tour-packages/category/[categorySlug]/page/[pageNumber]', 'page')
}

export const revalidateBlogContent = (slug?: Slug) => {
  if (slug) {
    revalidatePath(`/blog/${slug}`)
  }

  revalidateBlogArchives()
  revalidateBlogCategoryArchives()
  revalidateTag('blog-sitemap', 'max')
}

export const revalidateBlogCategoryContent = () => {
  revalidateBlogArchives()
  revalidateBlogCategoryArchives()
  revalidatePath('/blog/[slug]', 'page')
}

export const revalidateDestinationContent = (slug?: Slug) => {
  if (slug) {
    revalidatePath(`/destinations/${slug}`)
  }

  revalidateDestinationArchives()
  revalidateDestinationCategoryArchives()
  revalidateTag('destinations-sitemap', 'max')
}

export const revalidateDestinationCategoryContent = () => {
  revalidateDestinationArchives()
  revalidateDestinationCategoryArchives()
  revalidatePath('/destinations/[slug]', 'page')
}

export const revalidateTourPackageContent = (slug?: Slug) => {
  if (slug) {
    revalidatePath(`/tour-packages/${slug}`)
  }

  revalidateTourPackageArchives()
  revalidateTourPackageCategoryArchives()
  revalidateTag('tour-packages-sitemap', 'max')
}

export const revalidateTourPackageCategoryContent = () => {
  revalidateTourPackageArchives()
  revalidateTourPackageCategoryArchives()
  revalidatePath('/tour-packages/[slug]', 'page')
}

export const revalidateByContentType = (type: RevalidationContentType, slug?: Slug) => {
  if (type === 'blog') {
    revalidateBlogContent(slug)
    return
  }

  if (type === 'blog-category') {
    revalidateBlogCategoryContent()
    return
  }

  if (type === 'destination') {
    revalidateDestinationContent(slug)
    return
  }

  if (type === 'destination-category') {
    revalidateDestinationCategoryContent()
    return
  }

  if (type === 'tour-package') {
    revalidateTourPackageContent(slug)
    return
  }

  revalidateTourPackageCategoryContent()
}
