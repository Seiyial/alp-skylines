/*
  Warnings:

  - Made the column `writeup` on table `Episode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Episode" ALTER COLUMN "writeup" SET NOT NULL,
ALTER COLUMN "writeup" SET DEFAULT '[{"type":"paragraph","align":"left","children":[{"text":""}]}]';
