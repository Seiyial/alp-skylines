/*
  Warnings:

  - The values [past,in_progress] on the enum `EpisodeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EpisodeStatus_new" AS ENUM ('completed', 'current', 'planned');
ALTER TABLE "public"."Episode" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Episode" ALTER COLUMN "status" TYPE "public"."EpisodeStatus_new" USING ("status"::text::"public"."EpisodeStatus_new");
ALTER TYPE "public"."EpisodeStatus" RENAME TO "EpisodeStatus_old";
ALTER TYPE "public"."EpisodeStatus_new" RENAME TO "EpisodeStatus";
DROP TYPE "public"."EpisodeStatus_old";
ALTER TABLE "public"."Episode" ALTER COLUMN "status" SET DEFAULT 'planned';
COMMIT;
