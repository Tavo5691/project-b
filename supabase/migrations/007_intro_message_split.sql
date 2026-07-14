-- Splits the "Ya viene BabyB" intro message into two separate admin-editable
-- fields, matching the design PDF which shows two distinct blockquote-style
-- paragraphs under the heading instead of one combined message.
-- Additive-only: the old `intro_message` column from 006_intro_message.sql
-- is left in place (unused going forward), DEFAULT '' backfills existing
-- rows automatically, no separate backfill script or data loss risk.

ALTER TABLE settings ADD COLUMN intro_message_1 TEXT NOT NULL DEFAULT '';
ALTER TABLE settings ADD COLUMN intro_message_2 TEXT NOT NULL DEFAULT '';
