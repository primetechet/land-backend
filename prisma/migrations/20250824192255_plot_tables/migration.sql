-- CreateTable
CREATE TABLE "public"."plots" (
    "id" TEXT NOT NULL,
    "plot_id" TEXT NOT NULL,
    "block_number" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "area_meter_square" DOUBLE PRECISION NOT NULL,
    "remark" TEXT,
    "title_deed_application_id" TEXT NOT NULL,
    "land_use_id" TEXT NOT NULL,
    "land_grade_id" TEXT NOT NULL,
    "woreda_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "base_map_approved" BOOLEAN NOT NULL DEFAULT false,
    "base_map_approved_at" TIMESTAMP(3),
    "base_map_approved_by_id" TEXT,
    "base_map_approver_note" TEXT,
    "plot_registered" BOOLEAN NOT NULL DEFAULT false,
    "plot_registered_at" TIMESTAMP(3),
    "plot_registered_by_id" TEXT,
    "plot_registration_note" TEXT,
    "authorized" BOOLEAN NOT NULL DEFAULT false,
    "authorized_at" TIMESTAMP(3),
    "authorized_by_id" TEXT,
    "authorizer_note" TEXT,
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "rejected_at" TIMESTAMP(3),
    "rejected_by_id" TEXT,
    "rejecter_note" TEXT,
    "rejection_reason_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "plots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."land_uses" (
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

    CONSTRAINT "land_uses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."land_grades" (
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

    CONSTRAINT "land_grades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plots_plot_id_key" ON "public"."plots"("plot_id");

-- CreateIndex
CREATE UNIQUE INDEX "land_uses_name_key" ON "public"."land_uses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "land_grades_name_key" ON "public"."land_grades"("name");

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_land_use_id_fkey" FOREIGN KEY ("land_use_id") REFERENCES "public"."land_uses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_land_grade_id_fkey" FOREIGN KEY ("land_grade_id") REFERENCES "public"."land_grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_title_deed_application_id_fkey" FOREIGN KEY ("title_deed_application_id") REFERENCES "public"."title_deed_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_woreda_id_fkey" FOREIGN KEY ("woreda_id") REFERENCES "public"."woredas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_rejection_reason_id_fkey" FOREIGN KEY ("rejection_reason_id") REFERENCES "public"."rejection_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_rejected_by_id_fkey" FOREIGN KEY ("rejected_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_authorized_by_id_fkey" FOREIGN KEY ("authorized_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_plot_registered_by_id_fkey" FOREIGN KEY ("plot_registered_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_base_map_approved_by_id_fkey" FOREIGN KEY ("base_map_approved_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
