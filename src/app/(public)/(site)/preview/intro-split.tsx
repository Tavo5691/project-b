import Image from 'next/image'
import { SplitSection } from './shared'
import type { Settings } from '@/types/database'

/**
 * TEMPORARY — full-bleed intro.
 *
 * Photo on the left, message card on the right, each filling half the
 * viewport below the nav with only a thin gutter. Mobile is identical to the
 * production intro: stacked, square photo, generous padding.
 *
 * Note the photo uses `object-cover` in a tall panel, so a squarish source
 * image gets cropped top and bottom — `object-position` may need tuning once
 * the final photo is chosen.
 */
export function IntroSplit({ settings }: { settings: Settings }) {
  const photoUrl = settings.gallery_urls?.[0]

  return (
    <SplitSection
      bg="bg-intro-blue"
      mobileMaxWidth="max-w-5xl"
      mobileGap="gap-6"
      left={
        photoUrl ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg md:aspect-auto md:h-full">
            <Image
              src={photoUrl}
              alt="Foto de BabyB"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-square w-full rounded-lg bg-card-bg md:aspect-auto md:h-full" />
        )
      }
      right={
        <div className="flex flex-col justify-center gap-4 overflow-y-auto rounded-lg bg-teal p-6 md:h-full md:p-10 lg:p-16">
          <h2 className="font-block text-2xl text-cream lg:text-4xl">Ya viene BabyB</h2>
          {settings.intro_message_1 && (
            <div className="whitespace-pre-line border-l-4 border-cream pl-4 uppercase text-cream lg:text-lg">
              {settings.intro_message_1}
            </div>
          )}
          {settings.intro_message_2 && (
            <div className="whitespace-pre-line border-l-4 border-cream pl-4 uppercase text-cream lg:text-lg">
              {settings.intro_message_2}
            </div>
          )}
        </div>
      }
    />
  )
}
