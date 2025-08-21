/*
  Warnings:

  - The values [ADMIN,USER] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserType_new" AS ENUM ('ORGANIZATION', 'INDIVIDUAL');
ALTER TABLE "public"."users" ALTER COLUMN "user_type" TYPE "public"."UserType_new" USING ("user_type"::text::"public"."UserType_new");
ALTER TYPE "public"."UserType" RENAME TO "UserType_old";
ALTER TYPE "public"."UserType_new" RENAME TO "UserType";
DROP TYPE "public"."UserType_old";
COMMIT;
