/*
  Warnings:

  - Added the required column `global_id` to the `plots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `holding_type_id` to the `plots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenure_type_id` to the `plots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."plots" ADD COLUMN     "arch_gis_created_user" TEXT,
ADD COLUMN     "built_up_area" DOUBLE PRECISION,
ADD COLUMN     "certificate_number" TEXT,
ADD COLUMN     "floor_number" DOUBLE PRECISION,
ADD COLUMN     "global_id" TEXT NOT NULL,
ADD COLUMN     "holding_type_id" TEXT NOT NULL,
ADD COLUMN     "parcel_number" TEXT,
ADD COLUMN     "proportional_area" DOUBLE PRECISION,
ADD COLUMN     "tenure_type_id" TEXT NOT NULL,
ALTER COLUMN "block_number" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."holding_types" (
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

    CONSTRAINT "holding_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tenure_types" (
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

    CONSTRAINT "tenure_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "holding_types_name_key" ON "public"."holding_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tenure_types_name_key" ON "public"."tenure_types"("name");

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_holding_type_id_fkey" FOREIGN KEY ("holding_type_id") REFERENCES "public"."holding_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_tenure_type_id_fkey" FOREIGN KEY ("tenure_type_id") REFERENCES "public"."tenure_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
