/*
  Warnings:

  - A unique constraint covering the columns `[application_no]` on the table `title_deed_applications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `application_no` to the `title_deed_applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."title_deed_applications" ADD COLUMN     "application_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "title_deed_applications_application_no_key" ON "public"."title_deed_applications"("application_no");
