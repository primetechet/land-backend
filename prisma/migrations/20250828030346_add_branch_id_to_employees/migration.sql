-- AlterTable
ALTER TABLE "public"."employees" ADD COLUMN     "branch_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
