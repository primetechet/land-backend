/*
  Warnings:

  - You are about to drop the column `description` on the `title_deed_applications` table. All the data in the column will be lost.
  - You are about to drop the column `description_json` on the `title_deed_applications` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "public"."title_deed_applications" DROP COLUMN "description",
DROP COLUMN "description_json";

-- CreateTable
CREATE TABLE "public"."title_deed_application_owners" (
    "id" TEXT NOT NULL,
    "is_organization" BOOLEAN NOT NULL DEFAULT false,
    "id_type" "public"."IdType" NOT NULL,
    "id_number" TEXT NOT NULL,
    "is_applicant" BOOLEAN NOT NULL DEFAULT false,
    "first_name" TEXT NOT NULL,
    "father_name" TEXT NOT NULL,
    "grand_father_name" TEXT NOT NULL,
    "first_name_am" TEXT NOT NULL,
    "father_name_am" TEXT NOT NULL,
    "grand_father_name_am" TEXT NOT NULL,
    "mother_first_name" TEXT NOT NULL,
    "mother_father_name" TEXT NOT NULL,
    "mother_grand_father_name" TEXT NOT NULL,
    "mother_first_name_am" TEXT NOT NULL,
    "mother_father_name_am" TEXT NOT NULL,
    "mother_grand_father_name_am" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "kebele" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "title_deed_application_id" TEXT NOT NULL,
    "disability_status_id" TEXT NOT NULL,
    "nationality_id" TEXT NOT NULL,
    "residency_country_id" TEXT NOT NULL,
    "woreda_id" TEXT NOT NULL,
    "remark" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_application_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."disability_statuses" (
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

    CONSTRAINT "disability_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disability_statuses_name_key" ON "public"."disability_statuses"("name");

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_owners" ADD CONSTRAINT "title_deed_application_owners_title_deed_application_id_fkey" FOREIGN KEY ("title_deed_application_id") REFERENCES "public"."title_deed_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_owners" ADD CONSTRAINT "title_deed_application_owners_disability_status_id_fkey" FOREIGN KEY ("disability_status_id") REFERENCES "public"."disability_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_owners" ADD CONSTRAINT "title_deed_application_owners_woreda_id_fkey" FOREIGN KEY ("woreda_id") REFERENCES "public"."woredas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_owners" ADD CONSTRAINT "title_deed_application_owners_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "public"."countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_owners" ADD CONSTRAINT "title_deed_application_owners_residency_country_id_fkey" FOREIGN KEY ("residency_country_id") REFERENCES "public"."countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
