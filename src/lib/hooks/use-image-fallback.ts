'use client'

import { useState } from 'react'

/**
 * Reusable hook for image fallback logic.
 * Returns the current image source (starting with src if non-empty, else placeholder)
 * and an onError handler to fall back to the placeholder on broken external URLs.
 */
export function useImageFallback(src: string | null | undefined, placeholder: string) {
  const [currentSrc, setCurrentSrc] = useState<string>(
    src && src.length > 0 ? src : placeholder
  )

  const onError = () => {
    setCurrentSrc(placeholder)
  }

  return [currentSrc, onError] as const
}
