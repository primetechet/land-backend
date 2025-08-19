-- CreateTable
CREATE TABLE "public"."title_deed_applications" (
    "id" TEXT NOT NULL,
    "is_organization" BOOLEAN NOT NULL DEFAULT false,
    "title_deed_number" TEXT NOT NULL,
    "kebele" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "remark" TEXT,
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "title_deed_service_id" TEXT NOT NULL,
    "organization_type_id" TEXT,
    "woreda_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."title_deed_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "icon" JSONB,
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "has_existing_title_deed" BOOLEAN NOT NULL DEFAULT false,
    "parent_title_deed_service_id" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."title_deed_service_requirements" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "branch_id" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_service_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."title_deed_service_branches" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "branch_id" TEXT NOT NULL,
    "title_deed_service_id" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "title_deed_service_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "code" TEXT NOT NULL,
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "woreda_id" TEXT NOT NULL,
    "mesob" BOOLEAN NOT NULL DEFAULT false,
    "subcity" BOOLEAN NOT NULL DEFAULT false,
    "central" BOOLEAN NOT NULL DEFAULT false,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organization_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "organization_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "zip_code" TEXT NOT NULL,
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "country_id" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "region_id" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."woredas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "zip_code" TEXT NOT NULL,
    "district_id" TEXT NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "woredas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "title_deed_services_name_key" ON "public"."title_deed_services"("name");

-- CreateIndex
CREATE UNIQUE INDEX "branches_name_key" ON "public"."branches"("name");

-- CreateIndex
CREATE UNIQUE INDEX "organization_types_name_key" ON "public"."organization_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_key" ON "public"."regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_region_id_key" ON "public"."districts"("name", "region_id");

-- CreateIndex
CREATE UNIQUE INDEX "districts_zip_code_region_id_key" ON "public"."districts"("zip_code", "region_id");

-- CreateIndex
CREATE UNIQUE INDEX "woredas_name_district_id_key" ON "public"."woredas"("name", "district_id");

-- CreateIndex
CREATE UNIQUE INDEX "woredas_zip_code_district_id_key" ON "public"."woredas"("zip_code", "district_id");

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_organization_type_id_fkey" FOREIGN KEY ("organization_type_id") REFERENCES "public"."organization_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_title_deed_service_id_fkey" FOREIGN KEY ("title_deed_service_id") REFERENCES "public"."title_deed_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_woreda_id_fkey" FOREIGN KEY ("woreda_id") REFERENCES "public"."woredas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_applications" ADD CONSTRAINT "title_deed_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_services" ADD CONSTRAINT "title_deed_services_parent_title_deed_service_id_fkey" FOREIGN KEY ("parent_title_deed_service_id") REFERENCES "public"."title_deed_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_service_requirements" ADD CONSTRAINT "title_deed_service_requirements_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_service_branches" ADD CONSTRAINT "title_deed_service_branches_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."title_deed_service_branches" ADD CONSTRAINT "title_deed_service_branches_title_deed_service_id_fkey" FOREIGN KEY ("title_deed_service_id") REFERENCES "public"."title_deed_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."branches" ADD CONSTRAINT "branches_woreda_id_fkey" FOREIGN KEY ("woreda_id") REFERENCES "public"."woredas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regions" ADD CONSTRAINT "regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."districts" ADD CONSTRAINT "districts_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."woredas" ADD CONSTRAINT "woredas_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
