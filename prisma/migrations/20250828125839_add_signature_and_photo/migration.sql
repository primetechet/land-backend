-- AlterTable
ALTER TABLE "public"."title_deed_application_owners" ADD COLUMN     "migrated_from_xoka_system" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "photo" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "signature" JSONB NOT NULL DEFAULT '{}';
