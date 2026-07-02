import { describe, it, expect, vi, beforeEach } from 'vitest'

const rpcMock = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({ rpc: rpcMock })),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { reserveGift } from '@/actions/reserve'
import { revalidatePath } from 'next/cache'

function buildFormData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  return fd
}

describe('reserveGift', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    vi.mocked(revalidatePath).mockClear()
  })

  it('returns invalid_input when first_name is missing', async () => {
    const fd = buildFormData({ gift_id: 'gift-1', last_name: 'Perez' })
    const result = await reserveGift(null, fd)
    expect(result).toEqual({ success: false, error: 'invalid_input' })
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('returns invalid_input when gift_id is missing', async () => {
    const fd = buildFormData({ first_name: 'Ana', last_name: 'Perez' })
    const result = await reserveGift(null, fd)
    expect(result).toEqual({ success: false, error: 'invalid_input' })
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('returns success with cancelToken on RPC success', async () => {
    rpcMock.mockResolvedValueOnce({
      data: { success: true, cancel_token: 'ROSA-1234' },
      error: null,
    })
    const fd = buildFormData({ gift_id: 'gift-1', first_name: 'Ana', last_name: 'Perez' })
    const result = await reserveGift(null, fd)
    expect(result).toEqual({ success: true, cancelToken: 'ROSA-1234' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns already_reserved when RPC reports failure', async () => {
    rpcMock.mockResolvedValueOnce({
      data: { success: false, error: 'already_reserved' },
      error: null,
    })
    const fd = buildFormData({ gift_id: 'gift-1', first_name: 'Ana', last_name: 'Perez' })
    const result = await reserveGift(null, fd)
    expect(result).toEqual({ success: false, error: 'already_reserved' })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('retries once on UNIQUE violation and succeeds on second attempt', async () => {
    rpcMock
      .mockResolvedValueOnce({ data: null, error: { code: '23505', message: 'duplicate key' } })
      .mockResolvedValueOnce({
        data: { success: true, cancel_token: 'LUNA-5678' },
        error: null,
      })

    const fd = buildFormData({ gift_id: 'gift-1', first_name: 'Ana', last_name: 'Perez' })
    const result = await reserveGift(null, fd)
    expect(rpcMock).toHaveBeenCalledTimes(2)
    expect(result).toEqual({ success: true, cancelToken: 'LUNA-5678' })
  })

  it('returns db_error after unique violation retry also fails', async () => {
    rpcMock
      .mockResolvedValueOnce({ data: null, error: { code: '23505', message: 'duplicate key' } })
      .mockResolvedValueOnce({ data: null, error: { code: '23505', message: 'duplicate key' } })

    const fd = buildFormData({ gift_id: 'gift-1', first_name: 'Ana', last_name: 'Perez' })
    const result = await reserveGift(null, fd)
    expect(rpcMock).toHaveBeenCalledTimes(2)
    expect(result).toEqual({ success: false, error: 'db_error' })
  })

  it('returns db_error on non-unique RPC error without retrying', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { code: '500', message: 'oops' } })
    const fd = buildFormData({ gift_id: 'gift-1', first_name: 'Ana', last_name: 'Perez' })
    const result = await reserveGift(null, fd)
    expect(result).toEqual({ success: false, error: 'db_error' })
    expect(rpcMock).toHaveBeenCalledTimes(1)
  })
})
