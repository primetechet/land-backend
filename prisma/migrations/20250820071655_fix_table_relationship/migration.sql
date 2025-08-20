/*
  Warnings:

  - You are about to drop the column `branch_id` on the `title_deed_service_requirements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title_deed_service_id,branch_id]` on the table `title_deed_service_branches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title_deed_service_id,description]` on the table `title_deed_service_requirements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title_deed_service_id` to the `title_deed_service_requirements` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `title_deed_service_requirements` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."title_deed_service_requirements" DROP CONSTRAINT "title_deed_service_requirements_branch_id_fkey";

-- AlterTable
ALTER TABLE "public"."title_deed_service_requirements" DROP COLUMN "branch_id",
ADD COLUMN     "title_deed_service_id" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "title_deed_service_branches_title_deed_service_id_branch_id_key" ON "public"."title_deed_service_branches"("title_deed_service_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "title_deed_service_requirements_title_deed_service_id_descr_key" ON "public"."title_deed_service_requirements"("title_deed_service_id", "description");

-- AddForeignKey
ALTER TABLE "public"."title_deed_service_requirements" ADD CONSTRAINT "title_deed_service_requirements_title_deed_service_id_fkey" FOREIGN KEY ("title_deed_service_id") REFERENCES "public"."title_deed_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
