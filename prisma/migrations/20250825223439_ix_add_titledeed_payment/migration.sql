-- CreateEnum
CREATE TYPE "public"."TitleDeedApplicationPaymentReason" AS ENUM ('DOCUMENT_VERIFICATION', 'TECHNICAL_INSPECTION', 'CERTIFICATE_PRINTING');

-- CreateTable
CREATE TABLE "public"."title_deed_application_payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_reason" "public"."TitleDeedApplicationPaymentReason" NOT NULL,
    "title_deed_application_id" TEXT NOT NULL,
    "remark" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3),
    "paid_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_application_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_payments" ADD CONSTRAINT "title_deed_application_payments_title_deed_application_id_fkey" FOREIGN KEY ("title_deed_application_id") REFERENCES "public"."title_deed_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
