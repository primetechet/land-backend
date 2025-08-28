-- AlterTable
ALTER TABLE "public"."title_deed_applications" ADD COLUMN     "migrated_from_xoka_system" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "old_id" TEXT;
