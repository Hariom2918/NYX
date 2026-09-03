/**
 * Database types for Supabase tables.
 * Manually defined to match the schema in supabase/migrations/001_initial_schema.sql
 */

export type EventStatus = "draft" | "active" | "completed" | "cancelled";
export type PaymentStatus = "created" | "captured" | "failed";
export type TicketStatus = "issued" | "checked_in" | "void";
export type ScanResult = "success" | "duplicate" | "invalid";

export interface Event {
  id: string;
  name: string;
  description: string | null;
  venue: string;
  event_date: string;
  banner_url: string | null;
  status: EventStatus;
  created_at: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  price: number; // in paise
  quantity_total: number;
  quantity_sold: number;
  created_at: string;
}

export interface Order {
  id: string;
  event_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  amount: number; // in paise
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface Ticket {
  id: string;
  order_id: string;
  ticket_type_id: string;
  qr_token: string;
  status: TicketStatus;
  checked_in_at: string | null;
  checked_in_by: string | null;
  created_at: string;
}

export interface ScanLog {
  id: string;
  ticket_id: string | null;
  scanned_at: string;
  scanner_device_id: string | null;
  result: ScanResult;
}

/**
 * Order with associated ticket type selections.
 * Used when creating orders to track what the buyer selected.
 */
export interface OrderTicketSelection {
  ticket_type_id: string;
  quantity: number;
}
