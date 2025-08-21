-- CreateTable
CREATE TABLE "public"."title_deed_application_client_documents" (
    "id" TEXT NOT NULL,
    "title_deed_application_id" TEXT NOT NULL,
    "attachment" JSONB NOT NULL,
    "issued_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "title_deed_service_document_type_id" TEXT NOT NULL,
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "rejected_at" TIMESTAMP(3),
    "rejected_by_id" TEXT,
    "rejecter_note" TEXT,
    "rejection_reason_id" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" TEXT,
    "verifier_note" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "title_deed_application_client_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."title_deed_application_documents" (
    "id" TEXT NOT NULL,
    "title_deed_application_id" TEXT NOT NULL,
    "attachment" JSONB NOT NULL,
    "issued_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "title_deed_application_documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_client_documents" ADD CONSTRAINT "title_deed_application_client_documents_rejection_reason_i_fkey" FOREIGN KEY ("rejection_reason_id") REFERENCES "public"."rejection_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_client_documents" ADD CONSTRAINT "title_deed_application_client_documents_title_deed_applica_fkey" FOREIGN KEY ("title_deed_application_id") REFERENCES "public"."title_deed_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_client_documents" ADD CONSTRAINT "title_deed_application_client_documents_title_deed_service_fkey" FOREIGN KEY ("title_deed_service_document_type_id") REFERENCES "public"."document_category_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_client_documents" ADD CONSTRAINT "title_deed_application_client_documents_rejected_by_id_fkey" FOREIGN KEY ("rejected_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_client_documents" ADD CONSTRAINT "title_deed_application_client_documents_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_client_documents" ADD CONSTRAINT "title_deed_application_client_documents_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_documents" ADD CONSTRAINT "title_deed_application_documents_title_deed_application_id_fkey" FOREIGN KEY ("title_deed_application_id") REFERENCES "public"."title_deed_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_application_documents" ADD CONSTRAINT "title_deed_application_documents_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
