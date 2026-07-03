-- Base table/sequence/routine privileges for existing objects.
-- RLS policies (003_rls.sql) control row-level and operation-level access;
-- these GRANTs are the prerequisite Postgres checks before RLS is even evaluated.
-- service_role has BYPASSRLS, so granting it ALL is the intended trusted server-side key.
-- anon/authenticated get ALL here too, but RLS still restricts them to what
-- policies allow (only SELECT policies exist for anon on categories/settings/gifts).
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Same privileges for objects created in the future in this schema.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
