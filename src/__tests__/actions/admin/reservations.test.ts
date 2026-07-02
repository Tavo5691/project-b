import { describe, it, expect, vi, beforeEach } from 'vitest'

const rpcMock = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: vi.fn(async () => ({ rpc: rpcMock })),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { adminCancelReservation } from '@/actions/admin/reservations'
import { revalidatePath } from 'next/cache'

describe('adminCancelReservation', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    vi.mocked(revalidatePath).mockClear()
  })

  it('cancels the reservation and revalidates /admin and / on success', async () => {
    rpcMock.mockResolvedValueOnce({ data: { success: true }, error: null })
    const result = await adminCancelReservation('res-1')

    expect(result).toEqual({ success: true })
    expect(rpcMock).toHaveBeenCalledWith('cancel_reservation_admin', {
      p_reservation_id: 'res-1',
    })
    expect(revalidatePath).toHaveBeenCalledWith('/admin')
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns not_found when the RPC reports the reservation is missing', async () => {
    rpcMock.mockResolvedValueOnce({ data: { success: false, error: 'not_found' }, error: null })
    const result = await adminCancelReservation('res-missing')

    expect(result).toEqual({ success: false, error: 'not_found' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('returns db_error when the RPC call itself fails', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { code: '500', message: 'oops' } })
    const result = await adminCancelReservation('res-1')

    expect(result).toEqual({ success: false, error: 'db_error' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
