-- CreateTable
CREATE TABLE "public"."plot_properties" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "basement_floor_number" TEXT NOT NULL,
    "upper_floor_number" TEXT NOT NULL,
    "building_number" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "floor_number" TEXT NOT NULL,
    "estimated_price" DOUBLE PRECISION NOT NULL,
    "area_meter_square" DOUBLE PRECISION NOT NULL,
    "parking_area_meter_square" DOUBLE PRECISION NOT NULL,
    "building_size_meter_square" DOUBLE PRECISION NOT NULL,
    "number_of_lift" INTEGER NOT NULL,
    "remark" TEXT,
    "plot_id" TEXT NOT NULL,
    "property_use_id" TEXT NOT NULL,
    "property_type_id" TEXT NOT NULL,
    "base_map_approved" BOOLEAN NOT NULL DEFAULT false,
    "base_map_approved_at" TIMESTAMP(3),
    "base_map_approved_by_id" TEXT,
    "base_map_approver_note" TEXT,
    "plot_registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plot_registered_by_id" TEXT NOT NULL,
    "plot_registration_note" TEXT,
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "rejected_at" TIMESTAMP(3),
    "rejected_by_id" TEXT,
    "rejecter_note" TEXT,
    "rejection_reason_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "plot_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_types" (
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

    CONSTRAINT "property_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_uses" (
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

    CONSTRAINT "property_uses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plot_properties_property_id_key" ON "public"."plot_properties"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "property_types_name_key" ON "public"."property_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "property_uses_name_key" ON "public"."property_uses"("name");

-- AddForeignKey
ALTER TABLE "public"."plot_properties" ADD CONSTRAINT "plot_properties_property_use_id_fkey" FOREIGN KEY ("property_use_id") REFERENCES "public"."property_uses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plot_properties" ADD CONSTRAINT "plot_properties_property_type_id_fkey" FOREIGN KEY ("property_type_id") REFERENCES "public"."property_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plot_properties" ADD CONSTRAINT "plot_properties_plot_id_fkey" FOREIGN KEY ("plot_id") REFERENCES "public"."plots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plot_properties" ADD CONSTRAINT "plot_properties_rejection_reason_id_fkey" FOREIGN KEY ("rejection_reason_id") REFERENCES "public"."rejection_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plot_properties" ADD CONSTRAINT "plot_properties_rejected_by_id_fkey" FOREIGN KEY ("rejected_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plot_properties" ADD CONSTRAINT "plot_properties_plot_registered_by_id_fkey" FOREIGN KEY ("plot_registered_by_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plot_properties" ADD CONSTRAINT "plot_properties_base_map_approved_by_id_fkey" FOREIGN KEY ("base_map_approved_by_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
