import { createClient } from 'next-sanity'
import imageUrlBuilder  from '@sanity/image-url'
import type { SanityImage } from '@/types'

export const sanityConfig = {
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'your-project-id',
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:     process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(sanityConfig)

const builder = imageUrlBuilder(sanityClient)

export function urlForImage(source: SanityImage) {
  return builder.image(source)
}
