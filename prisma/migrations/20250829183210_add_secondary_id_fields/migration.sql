-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "primary_id_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "secondary_id" TEXT,
ADD COLUMN     "secondary_id_type" "public"."IdType",
ADD COLUMN     "secondary_id_verified" BOOLEAN NOT NULL DEFAULT false;
