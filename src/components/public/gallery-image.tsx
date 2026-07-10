'use client'

import Image from 'next/image'
import { useImageFallback } from '@/lib/hooks/use-image-fallback'

const PLACEHOLDER_SRC = '/images/gift-placeholder.svg'

interface GalleryImageProps {
  src: string
  alt: string
}

/**
 * Client island for a single gallery tile: uses shared `useImageFallback` hook
 * for onError fallback pattern (broken external URL -> placeholder SVG).
 */
export function GalleryImage({ src, alt }: GalleryImageProps) {
  const [currentSrc, onError] = useImageFallback(src, PLACEHOLDER_SRC)

  return (
    <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-lg bg-card-bg">
      <Image
        src={currentSrc}
        alt={alt}
        fill
        sizes="160px"
        className="object-cover"
        onError={onError}
      />
    </div>
  )
}
