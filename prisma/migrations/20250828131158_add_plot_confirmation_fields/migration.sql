-- AlterTable
ALTER TABLE "public"."plots" ADD COLUMN     "client_confirmation_note" TEXT,
ADD COLUMN     "client_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "client_confirmed_at" TIMESTAMP(3),
ADD COLUMN     "client_rejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "client_rejected_at" TIMESTAMP(3),
ADD COLUMN     "client_rejection_note" TEXT;
