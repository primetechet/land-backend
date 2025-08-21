/*
  Warnings:

  - You are about to drop the column `central` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `mesob` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `subcity` on the `branches` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."BranchType" AS ENUM ('CENTRAL', 'MESOB', 'SUB_CITY');

-- AlterTable
ALTER TABLE "public"."branches" DROP COLUMN "central",
DROP COLUMN "mesob",
DROP COLUMN "subcity",
ADD COLUMN     "branch_type" "public"."BranchType" NOT NULL DEFAULT 'SUB_CITY';
