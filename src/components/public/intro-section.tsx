import Image from 'next/image'
import type { Settings } from '@/types/database'

interface IntroSectionProps {
  settings: Settings
}

/**
 * "Ya viene BabyB" intro section — a full-viewport blue section (matching
 * the splash page's `min-h-screen` treatment) with a two-column split
 * (photo + teal message card) inset inside it on wider screens, stacked on
 * mobile. Server Component: the photo has no `onError` fallback (that
 * requires a client boundary, see `gallery-image.tsx`) — it simply doesn't
 * render when there's no URL.
 */
export function IntroSection({ settings }: IntroSectionProps) {
  const photoUrl = settings.gallery_urls?.[0]

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center bg-intro-blue px-6 py-16 sm:px-12">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
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

        <div className="flex flex-col gap-4 rounded-lg bg-teal p-6">
          <h2 className="font-block text-2xl text-cream">Ya viene BabyB</h2>
          {settings.intro_message_1 && (
            <div className="whitespace-pre-line border-l-4 border-cream pl-4 uppercase text-cream">
              {settings.intro_message_1}
            </div>
          )}
          {settings.intro_message_2 && (
            <div className="whitespace-pre-line border-l-4 border-cream pl-4 uppercase text-cream">
              {settings.intro_message_2}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
