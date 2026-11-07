-- Phase 1 demo cleanup: drop the demo_bookings table and its enum.
-- This is demo cleanup explicitly ordered for Phase 1, not a final-table migration.
-- DropTable
DROP TABLE "demo_bookings";

-- DropEnum
DROP TYPE "DemoBookingStatus";
