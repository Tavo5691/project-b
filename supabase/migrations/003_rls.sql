ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public read access (anon role)
CREATE POLICY "categories_public_read" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "settings_public_read"   ON settings   FOR SELECT TO anon USING (true);
CREATE POLICY "gifts_public_read"      ON gifts       FOR SELECT TO anon USING (true);

-- No direct anon writes: all mutations go through SECURITY DEFINER RPCs
-- Service role bypasses RLS automatically (used server-side for admin operations)
