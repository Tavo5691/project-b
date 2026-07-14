-- Adds the "Ya viene BabyB" intro/welcome message shown on the public
-- invitation page above the event info section.
-- Additive-only: DEFAULT '' backfills existing rows automatically, no
-- separate backfill script or data loss risk.

ALTER TABLE settings ADD COLUMN intro_message TEXT NOT NULL DEFAULT '';
