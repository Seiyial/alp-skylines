-- CreateEnum
CREATE TYPE "public"."EpisodeStatus" AS ENUM ('past', 'in_progress', 'planned');

-- AlterTable
ALTER TABLE "public"."Episode" ADD COLUMN     "status" "public"."EpisodeStatus" NOT NULL DEFAULT 'planned';
