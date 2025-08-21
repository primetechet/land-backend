-- AlterTable
ALTER TABLE "public"."title_deed_applications" ADD COLUMN     "submitted" BOOLEAN,
ADD COLUMN     "submitted_at" TIMESTAMP(3);
