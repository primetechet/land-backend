-- CreateTable
CREATE TABLE "public"."title_deed_service_payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_reason" "public"."TitleDeedApplicationPaymentReason" NOT NULL,
    "title_deed_service_id" TEXT NOT NULL,
    "remark" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_service_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."title_deed_service_payments" ADD CONSTRAINT "title_deed_service_payments_title_deed_service_id_fkey" FOREIGN KEY ("title_deed_service_id") REFERENCES "public"."title_deed_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
