'use client'

import { useState } from 'react'
import { ReserveModal } from '@/components/public/reserve-modal'

interface ReserveButtonProps {
  giftId: string
  giftName: string
}

/**
 * Client island rendered inside the Server `GiftCard`. Owns the modal's
 * open/close state locally so `GiftCard` itself stays a Server Component.
 */
export function ReserveButton({ giftId, giftName }: ReserveButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Reservar
      </button>
      {isOpen && (
        <ReserveModal giftId={giftId} giftName={giftName} onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}
