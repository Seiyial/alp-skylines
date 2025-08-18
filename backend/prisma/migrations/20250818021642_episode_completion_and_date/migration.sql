-- AlterTable
ALTER TABLE "public"."Episode" ADD COLUMN     "completedOn" TIMESTAMP(3),
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
