/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `title_deed_application_appointments` table. All the data in the column will be lost.
  - You are about to drop the column `date_time` on the `title_deed_application_appointments` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `title_deed_application_appointments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `title_deed_application_appointments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by_id` on the `title_deed_application_appointments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employee_id,scheduled_date,slot_id]` on the table `title_deed_application_appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employee_id` to the `title_deed_application_appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_date` to the `title_deed_application_appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slot_id` to the `title_deed_application_appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."title_deed_application_appointments" DROP COLUMN "created_by_id",
DROP COLUMN "date_time",
DROP COLUMN "remark",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by_id",
ADD COLUMN     "employee_id" TEXT NOT NULL,
ADD COLUMN     "scheduled_date" DATE NOT NULL,
ADD COLUMN     "slot_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."title_deed_applications" ADD COLUMN     "appointment_reschedule_count" SMALLINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."slots" (
    "id" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee_off_slots" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "slot_id" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "employee_off_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slots_start_time_end_time_key" ON "public"."slots"("start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "employee_off_slots_employee_id_date_slot_id_key" ON "public"."employee_off_slots"("employee_id", "date", "slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "title_deed_application_appointments_employee_id_scheduled_d_key" ON "public"."title_deed_application_appointments"("employee_id", "scheduled_date", "slot_id");

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_appointments" ADD CONSTRAINT "title_deed_application_appointments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_appointments" ADD CONSTRAINT "title_deed_application_appointments_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "public"."slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee_off_slots" ADD CONSTRAINT "employee_off_slots_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee_off_slots" ADD CONSTRAINT "employee_off_slots_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "public"."slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
