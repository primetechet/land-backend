/*
  Warnings:

  - Made the column `completed` on table `title_deed_application_reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `archived` on table `title_deed_applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorized` on table `title_deed_applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `base_map_approved` on table `title_deed_applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plot_registered` on table `title_deed_applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rejected` on table `title_deed_applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `verified` on table `title_deed_applications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `submitted` on table `title_deed_applications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."title_deed_application_reviews" ALTER COLUMN "completed" SET NOT NULL,
ALTER COLUMN "completed" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."title_deed_applications" ALTER COLUMN "archived" SET NOT NULL,
ALTER COLUMN "archived" SET DEFAULT false,
ALTER COLUMN "authorized" SET NOT NULL,
ALTER COLUMN "authorized" SET DEFAULT false,
ALTER COLUMN "base_map_approved" SET NOT NULL,
ALTER COLUMN "base_map_approved" SET DEFAULT false,
ALTER COLUMN "plot_registered" SET NOT NULL,
ALTER COLUMN "plot_registered" SET DEFAULT false,
ALTER COLUMN "rejected" SET NOT NULL,
ALTER COLUMN "rejected" SET DEFAULT false,
ALTER COLUMN "verified" SET NOT NULL,
ALTER COLUMN "verified" SET DEFAULT false,
ALTER COLUMN "submitted" SET NOT NULL,
ALTER COLUMN "submitted" SET DEFAULT false;
