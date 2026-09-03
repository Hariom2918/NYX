-- ============================================
-- Nyx Event Ticketing Platform — Initial Schema
-- ============================================

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  venue TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  banner_url TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket Types
CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity_total INTEGER NOT NULL,
  quantity_sold INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  amount INTEGER NOT NULL,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'created'
    CHECK (payment_status IN ('created', 'captured', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Order line items — tracks which ticket types were selected per order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES ticket_types(id),
  qr_token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'issued'
    CHECK (status IN ('issued', 'checked_in', 'void')),
  checked_in_at TIMESTAMPTZ,
  checked_in_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Scan Logs
CREATE TABLE IF NOT EXISTS scan_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id),
  scanned_at TIMESTAMPTZ DEFAULT now(),
  scanner_device_id TEXT,
  result TEXT NOT NULL
    CHECK (result IN ('success', 'duplicate', 'invalid'))
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tickets_qr_token ON tickets(qr_token);
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_id ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_event_id ON orders(event_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_ticket_id ON scan_logs(ticket_id);

-- ============================================
-- Seed data — single test event
-- ============================================
INSERT INTO events (id, name, description, venue, event_date, status)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Nyx After Dark',
  'An exclusive night of music, art, and immersive experiences. Step into a world where boundaries blur and creativity flows. Live performances, interactive installations, and an atmosphere unlike anything you''ve experienced.',
  'The Grand Ballroom, Mumbai',
  '2026-09-27T19:00:00+05:30',
  'active'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ticket_types (event_id, name, price, quantity_total) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'General Admission', 49900, 200),
  ('550e8400-e29b-41d4-a716-446655440000', 'VIP', 149900, 50),
  ('550e8400-e29b-41d4-a716-446655440000', 'VVIP', 299900, 20)
ON CONFLICT DO NOTHING;
