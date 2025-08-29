-- AlterTable
ALTER TABLE "public"."title_deed_application_owners" ADD COLUMN     "rejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejected_at" TIMESTAMP(3),
ADD COLUMN     "rejected_by_id" TEXT,
ADD COLUMN     "rejecter_note" TEXT,
ADD COLUMN     "rejection_reason_id" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verified_at" TIMESTAMP(3),
ADD COLUMN     "verified_by_id" TEXT,
ADD COLUMN     "verifier_note" TEXT;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_owners" ADD CONSTRAINT "title_deed_application_owners_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_owners" ADD CONSTRAINT "title_deed_application_owners_rejected_by_id_fkey" FOREIGN KEY ("rejected_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_owners" ADD CONSTRAINT "title_deed_application_owners_rejection_reason_id_fkey" FOREIGN KEY ("rejection_reason_id") REFERENCES "public"."rejection_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
