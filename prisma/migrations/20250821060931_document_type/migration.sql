-- CreateTable
CREATE TABLE "public"."document_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "size" INTEGER DEFAULT 5,
    "min_document_count" INTEGER NOT NULL DEFAULT 1,
    "max_document_count" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "description_json" JSONB DEFAULT '{}',
    "allowed_file_types" JSONB DEFAULT '{}',
    "check_hint" TEXT,
    "expires" BOOLEAN NOT NULL DEFAULT false,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."document_category_types" (
    "id" TEXT NOT NULL,
    "properties_json" JSONB,
    "description" TEXT,
    "title_deed_service_id" TEXT NOT NULL,
    "document_type_id" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "document_category_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_types_name_key" ON "public"."document_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_code_key" ON "public"."document_types"("code");

-- AddForeignKey
ALTER TABLE "public"."document_category_types" ADD CONSTRAINT "document_category_types_title_deed_service_id_fkey" FOREIGN KEY ("title_deed_service_id") REFERENCES "public"."title_deed_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_category_types" ADD CONSTRAINT "document_category_types_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "public"."document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
