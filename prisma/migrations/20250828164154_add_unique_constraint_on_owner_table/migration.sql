/*
  Warnings:

  - A unique constraint covering the columns `[id_number,title_deed_application_id]` on the table `title_deed_application_owners` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "title_deed_application_owners_id_number_title_deed_applicat_key" ON "public"."title_deed_application_owners"("id_number", "title_deed_application_id");
