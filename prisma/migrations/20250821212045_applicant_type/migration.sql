/*
  Warnings:

  - You are about to drop the column `individual_only` on the `title_deed_services` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."APPLICANT_TYPE" AS ENUM ('INDIVIDUAL', 'ORGANIZATION', 'BOTH');

-- AlterTable
ALTER TABLE "public"."title_deed_services" DROP COLUMN "individual_only",
ADD COLUMN     "applicant_type" "public"."APPLICANT_TYPE" NOT NULL DEFAULT 'BOTH';
