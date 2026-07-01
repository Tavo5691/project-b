// TypeScript types matching the Supabase schema

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Settings {
  id: 1
  welcome_title: string
  welcome_subtitle: string
  event_date: string
  event_time: string
  event_address: string
  maps_url: string
  cash_note: string
  bank_name: string
  bank_account: string
  bank_holder: string
}

export interface Gift {
  id: string
  category_id: string
  name: string
  description: string
  image_url: string
  external_link: string
  status: 'available' | 'reserved'
  created_at: string
}

export interface Reservation {
  id: string
  gift_id: string
  first_name: string
  last_name: string
  message: string | null
  cancel_token: string
  created_at: string
}

export interface ReservationWithGift extends Reservation {
  gift: Gift
}

export interface GiftWithCategory extends Gift {
  category: Category
}

// RPC return types

export interface ReserveGiftResult {
  success: boolean
  cancel_token?: string
  error?: 'already_reserved'
}

export interface CancelReservationResult {
  success: boolean
  gift_name?: string
  first_name?: string
  last_name?: string
  error?: 'not_found'
}

export interface CancelReservationAdminResult {
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
      }
      settings: {
        Row: Settings
        Insert: Partial<Settings>
        Update: Partial<Omit<Settings, 'id'>>
      }
      gifts: {
        Row: Gift
        Insert: Omit<Gift, 'id' | 'created_at'>
        Update: Partial<Omit<Gift, 'id' | 'created_at'>>
      }
      reservations: {
        Row: Reservation
        Insert: Omit<Reservation, 'id' | 'created_at'>
        Update: Partial<Omit<Reservation, 'id' | 'created_at'>>
      }
    }
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
