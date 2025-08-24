/*
  Warnings:

  - You are about to drop the column `plot_registered` on the `plots` table. All the data in the column will be lost.
  - Made the column `plot_registered_at` on table `plots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plot_registered_by_id` on table `plots` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."plots" DROP CONSTRAINT "plots_plot_registered_by_id_fkey";

-- AlterTable
ALTER TABLE "public"."plots" DROP COLUMN "plot_registered",
ALTER COLUMN "plot_registered_at" SET NOT NULL,
ALTER COLUMN "plot_registered_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "plot_registered_by_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_plot_registered_by_id_fkey" FOREIGN KEY ("plot_registered_by_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
