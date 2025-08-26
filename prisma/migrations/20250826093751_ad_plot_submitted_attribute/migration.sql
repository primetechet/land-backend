-- AlterTable
ALTER TABLE "public"."plots" ADD COLUMN     "submitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submitted_at" TIMESTAMP(3);
