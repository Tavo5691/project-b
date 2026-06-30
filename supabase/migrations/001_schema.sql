-- categories
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- settings (single row, id=1)
CREATE TABLE settings (
  id               INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  welcome_title    TEXT NOT NULL DEFAULT '',
  welcome_subtitle TEXT NOT NULL DEFAULT '',
  event_date       TEXT NOT NULL DEFAULT '',
  event_time       TEXT NOT NULL DEFAULT '',
  event_address    TEXT NOT NULL DEFAULT '',
  maps_url         TEXT NOT NULL DEFAULT '',
  cash_note        TEXT NOT NULL DEFAULT '',
  bank_name        TEXT NOT NULL DEFAULT '',
  bank_account     TEXT NOT NULL DEFAULT '',
  bank_holder      TEXT NOT NULL DEFAULT ''
);
INSERT INTO settings (id) VALUES (1);

-- gifts
CREATE TABLE gifts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name          TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  image_url     TEXT NOT NULL DEFAULT '',
  external_link TEXT NOT NULL DEFAULT '',
  status        TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_gifts_category ON gifts(category_id);
CREATE INDEX idx_gifts_name     ON gifts(name);

-- reservations
CREATE TABLE reservations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id      UUID NOT NULL REFERENCES gifts(id) ON DELETE RESTRICT,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  message      TEXT,
  cancel_token TEXT UNIQUE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
