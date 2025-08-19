/*
  Warnings:

  - You are about to drop the column `description` on the `Episode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Episode" DROP COLUMN "description",
ADD COLUMN     "writeup" JSONB;
