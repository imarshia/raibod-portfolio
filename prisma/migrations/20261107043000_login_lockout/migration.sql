-- Login lockout columns (post-PoC gap, 2026-11-07).
-- Failed attempts are counted per account; the account locks for 15 minutes
-- after 5 consecutive failures. See src/lib/auth.ts.
ALTER TABLE "users" ADD COLUMN "failed_login_attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "locked_until" TIMESTAMP(3);
