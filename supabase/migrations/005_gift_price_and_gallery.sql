-- Adds gift pricing (ARS integer, 0 = unpriced/hidden on public card) and an
-- unbounded landing-page photo gallery (settings.gallery_urls).
-- Additive-only: DEFAULT values backfill existing rows automatically, no
-- separate backfill script or data loss risk.

ALTER TABLE gifts    ADD COLUMN price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0);
ALTER TABLE settings ADD COLUMN gallery_urls TEXT[] NOT NULL DEFAULT '{}';
