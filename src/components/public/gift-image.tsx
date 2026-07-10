'use client'

import Image from 'next/image'
import { useImageFallback } from '@/lib/hooks/use-image-fallback'

const PLACEHOLDER_SRC = '/images/gift-placeholder.svg'

interface GiftImageProps {
  src: string | null
  alt: string
}

/**
 * Client island: `next/image` requires a client boundary to react to
 * `onError`, so the broken-image fallback lives here and is composed
 * into the Server `GiftCard`.
 */
export function GiftImage({ src, alt }: GiftImageProps) {
  const [currentSrc, onError] = useImageFallback(src, PLACEHOLDER_SRC)

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-card-bg">
      <Image
        src={currentSrc}
        alt={alt}
        fill
        sizes="(min-width: 768px) 33vw, 50vw"
        className="object-cover"
        onError={onError}
      />
    </div>
  )
}
