import { GalleryImage } from '@/components/public/gallery-image'

interface PhotoGalleryProps {
  urls: string[]
}

/**
 * Renders `settings.gallery_urls` as a horizontal-scroll strip of photos.
 * Unbounded — any array length (including zero) is supported; an empty
 * array renders nothing (no fixed empty slots).
 */
export function PhotoGallery({ urls }: PhotoGalleryProps) {
  if (urls.length === 0) return null

  return (
    <div className="category-tabs">
      {/* Intentionally reuses .category-tabs from globals.css for horizontal-scroll-strip
          styling, not a copy-paste from CategoryTabs. */}
      {urls.map((url, index) => (
        <GalleryImage key={url + index} src={url} alt={`Foto ${index + 1}`} />
      ))}
    </div>
  )
}
