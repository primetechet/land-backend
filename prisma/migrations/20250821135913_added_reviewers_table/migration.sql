/*
  Warnings:

  - You are about to drop the column `draft` on the `title_deed_applications` table. All the data in the column will be lost.
  - You are about to drop the column `drafted_at` on the `title_deed_applications` table. All the data in the column will be lost.
  - You are about to drop the column `drafted_by_id` on the `title_deed_applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."title_deed_applications" DROP COLUMN "draft",
DROP COLUMN "drafted_at",
DROP COLUMN "drafted_by_id",
ADD COLUMN     "archive_note" TEXT,
ADD COLUMN     "archived" BOOLEAN,
ADD COLUMN     "archived_at" TIMESTAMP(3),
ADD COLUMN     "archived_by_id" TEXT,
ADD COLUMN     "authorized" BOOLEAN,
ADD COLUMN     "authorized_at" TIMESTAMP(3),
ADD COLUMN     "authorized_by_id" TEXT,
ADD COLUMN     "authorizer_note" TEXT,
ADD COLUMN     "base_map_approved" BOOLEAN,
ADD COLUMN     "base_map_approved_at" TIMESTAMP(3),
ADD COLUMN     "base_map_approved_by_id" TEXT,
ADD COLUMN     "base_map_approver_note" TEXT,
ADD COLUMN     "plot_registered" BOOLEAN,
ADD COLUMN     "plot_registered_at" TIMESTAMP(3),
ADD COLUMN     "plot_registered_by_id" TEXT,
ADD COLUMN     "plot_registration_note" TEXT,
ADD COLUMN     "rejected" BOOLEAN,
ADD COLUMN     "rejected_at" TIMESTAMP(3),
ADD COLUMN     "rejected_by_id" TEXT,
ADD COLUMN     "rejecter_note" TEXT,
ADD COLUMN     "rejection_reason_id" TEXT,
ADD COLUMN     "verified" BOOLEAN,
ADD COLUMN     "verified_at" TIMESTAMP(3),
ADD COLUMN     "verified_by_id" TEXT,
ADD COLUMN     "verifier_note" TEXT;

-- CreateTable
CREATE TABLE "public"."title_deed_application_reviews" (
    "id" TEXT NOT NULL,
    "reassigned" BOOLEAN NOT NULL DEFAULT false,
    "assignment_note" TEXT,
    "employee_id" TEXT NOT NULL,
    "title_deed_application_id" TEXT NOT NULL,
    "completed" BOOLEAN,
    "completed_at" TIMESTAMP(3),
    "completed_by_id" TEXT,
    "note" TEXT,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_application_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rejection_reasons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "rejection_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rejection_reasons_name_key" ON "public"."rejection_reasons"("name");

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_rejection_reason_id_fkey" FOREIGN KEY ("rejection_reason_id") REFERENCES "public"."rejection_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_rejected_by_id_fkey" FOREIGN KEY ("rejected_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_archived_by_id_fkey" FOREIGN KEY ("archived_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_authorized_by_id_fkey" FOREIGN KEY ("authorized_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_plot_registered_by_id_fkey" FOREIGN KEY ("plot_registered_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_base_map_approved_by_id_fkey" FOREIGN KEY ("base_map_approved_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_reviews" ADD CONSTRAINT "title_deed_application_reviews_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_reviews" ADD CONSTRAINT "title_deed_application_reviews_title_deed_application_id_fkey" FOREIGN KEY ("title_deed_application_id") REFERENCES "public"."title_deed_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
