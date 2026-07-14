import Image from 'next/image'
import type { Settings } from '@/types/database'

interface IntroSectionProps {
  settings: Settings
}

/**
 * "Ya viene BabyB" intro section — a two-column split (photo + teal message
 * card) on wider screens, stacked on mobile. Server Component: the photo has
 * no `onError` fallback (that requires a client boundary, see
 * `gallery-image.tsx`) — it simply doesn't render when there's no URL.
 */
export function IntroSection({ settings }: IntroSectionProps) {
  const photoUrl = settings.gallery_urls?.[0]

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {photoUrl ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={photoUrl}
            alt="Foto de BabyB"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="aspect-square w-full rounded-lg bg-card-bg" />
      )}

      <div className="flex flex-col gap-3 rounded-lg bg-teal p-6">
        <h2 className="font-block text-2xl text-cream">Ya viene BabyB</h2>
        {settings.intro_message && (
          <div className="whitespace-pre-line text-cream">{settings.intro_message}</div>
        )}
      </div>
    </section>
  )
}
