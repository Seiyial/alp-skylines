/*
  Warnings:

  - A unique constraint covering the columns `[codename]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codename` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "codename" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_codename_key" ON "public"."Project"("codename");
