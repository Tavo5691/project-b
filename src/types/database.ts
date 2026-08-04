// TypeScript types matching the Supabase schema
//
// NOTE: these are declared with `type`, not `interface`. The Supabase
// client's generic `.rpc()` / `.from()` inference (postgrest-js 2.x) relies
// on deeply nested conditional types keyed off `Database['public']`. When
// these row shapes are `interface`s, TypeScript's inference backs off and
// every `.rpc()` call's `args` parameter collapses to `never`, which then
// rejects any object literal. Type aliases resolve eagerly and keep the
// inference working. Verified in isolation against @supabase/postgrest-js
// 2.108.2 — do not convert these back to `interface`.

export type Category = {
  id: string
  name: string
  created_at: string
}

export type Settings = {
  id: 1
  welcome_title: string
  welcome_subtitle: string
  intro_message_1: string
  intro_message_2: string
  event_date: string
  event_time: string
  event_address: string
  maps_url: string
  cash_note: string
  gallery_urls: string[]
}

export type Gift = {
  id: string
  category_id: string
  name: string
  description: string
  image_url: string
  external_link: string
  status: 'available' | 'reserved'
  price: number
  created_at: string
}

export type Reservation = {
  id: string
  gift_id: string
  first_name: string
  last_name: string
  message: string | null
  cancel_token: string
  created_at: string
}

export type ReservationWithGift = Reservation & {
  gift: Gift
}

export type GiftWithCategory = Gift & {
  category: Category
}

// RPC return types

export type ReserveGiftResult = {
  success: boolean
  cancel_token?: string
  error?: 'already_reserved'
}

export type CancelReservationResult = {
  success: boolean
  gift_name?: string
  first_name?: string
  last_name?: string
  error?: 'not_found'
}

export type CancelReservationAdminResult = {
  success: boolean
  error?: 'not_found'
}

// Supabase Database type for generic client typing
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
        Relationships: []
      }
      settings: {
        Row: Settings
        Insert: Partial<Settings>
        Update: Partial<Omit<Settings, 'id'>>
        Relationships: []
      }
      gifts: {
        Row: Gift
        Insert: Omit<Gift, 'id' | 'created_at'>
        Update: Partial<Omit<Gift, 'id' | 'created_at'>>
        Relationships: []
      }
      reservations: {
        Row: Reservation
        Insert: Omit<Reservation, 'id' | 'created_at'>
        Update: Partial<Omit<Reservation, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    // No database views yet — required by @supabase/postgrest-js's
    // GenericSchema constraint even when empty.
    Views: Record<string, never>
    Functions: {
      reserve_gift: {
        Args: {
          p_gift_id: string
          p_first_name: string
          p_last_name: string
          p_message: string | null
          p_cancel_token: string
        }
        Returns: ReserveGiftResult
      }
      cancel_reservation: {
        Args: { p_cancel_token: string }
        Returns: CancelReservationResult
      }
      cancel_reservation_admin: {
        Args: { p_reservation_id: string }
        Returns: CancelReservationAdminResult
      }
    }
  }
}
