-- AlterTable
ALTER TABLE "public"."title_deed_applications" ADD COLUMN     "appointment_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "appointment_required_at" TIMESTAMP(3),
ADD COLUMN     "appointment_required_by_id" TEXT;

-- CreateTable
CREATE TABLE "public"."title_deed_application_appointments" (
    "id" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "title_deed_application_id" TEXT NOT NULL,
    "remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_application_appointments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_appointment_required_by_id_fkey" FOREIGN KEY ("appointment_required_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_appointments" ADD CONSTRAINT "title_deed_application_appointments_title_deed_application_fkey" FOREIGN KEY ("title_deed_application_id") REFERENCES "public"."title_deed_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
