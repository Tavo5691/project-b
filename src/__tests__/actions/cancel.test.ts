import { describe, it, expect, vi, beforeEach } from 'vitest'

const rpcMock = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({ rpc: rpcMock })),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { cancelReservation } from '@/actions/cancel'
import { revalidatePath } from 'next/cache'

function buildFormData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  return fd
}

describe('cancelReservation', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    vi.mocked(revalidatePath).mockClear()
  })

  it('returns invalid_input when cancel_token is empty', async () => {
    const fd = buildFormData({ cancel_token: '   ' })
    const result = await cancelReservation(null, fd)
    expect(result).toEqual({ success: false, error: 'invalid_input' })
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('returns success with gift/holder info on RPC success and normalizes the token', async () => {
    rpcMock.mockResolvedValueOnce({
      data: { success: true, gift_name: 'Coche', first_name: 'Ana', last_name: 'Perez' },
      error: null,
    })
    const fd = buildFormData({ cancel_token: ' rosa-4821 ' })
    const result = await cancelReservation(null, fd)
    expect(result).toEqual({
      success: true,
      giftName: 'Coche',
      firstName: 'Ana',
      lastName: 'Perez',
    })
    expect(rpcMock).toHaveBeenCalledWith('cancel_reservation', { p_cancel_token: 'ROSA-4821' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns not_found when RPC reports no match', async () => {
    rpcMock.mockResolvedValueOnce({ data: { success: false, error: 'not_found' }, error: null })
    const fd = buildFormData({ cancel_token: 'ROSA-0000' })
    const result = await cancelReservation(null, fd)
    expect(result).toEqual({ success: false, error: 'not_found' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('returns db_error on RPC error', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { code: '500', message: 'oops' } })
    const fd = buildFormData({ cancel_token: 'ROSA-4821' })
    const result = await cancelReservation(null, fd)
    expect(result).toEqual({ success: false, error: 'db_error' })
  })
})
