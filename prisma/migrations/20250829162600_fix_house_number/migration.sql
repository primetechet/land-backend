/*
  Warnings:

  - Added the required column `geo` to the `plots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."plots" ADD COLUMN     "geo" JSONB NOT NULL,
ALTER COLUMN "house_number" DROP NOT NULL;
