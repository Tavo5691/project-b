import { GiftImage } from '@/components/public/gift-image'
import { ReserveButton } from '@/components/public/reserve-button'
import type { Gift } from '@/types/database'

interface GiftCardProps {
  gift: Gift
  onReserve: (gift: Gift) => void
}

export function GiftCard({ gift, onReserve }: GiftCardProps) {
  const isReserved = gift.status === 'reserved'

  return (
    <div
      className={
        isReserved
          ? 'flex flex-col gap-3 rounded-lg border border-border bg-card-bg p-4 opacity-60'
          : 'flex flex-col gap-3 rounded-lg border border-border bg-card-bg p-4'
      }
    >
      <GiftImage src={gift.image_url} alt={gift.name} />

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-text">{gift.name}</h3>
        {gift.description && <p className="text-sm text-text-muted">{gift.description}</p>}
        {gift.external_link && (
          <a
            href={gift.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline"
          >
            Ver producto
          </a>
        )}
      </div>

      <ReserveButton isReserved={isReserved} onReserve={() => onReserve(gift)} />
    </div>
  )
}
