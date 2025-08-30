/*
  Warnings:

  - A unique constraint covering the columns `[base_map_id]` on the table `plots` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."plots" ADD COLUMN     "base_map_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "plots_base_map_id_key" ON "public"."plots"("base_map_id");
