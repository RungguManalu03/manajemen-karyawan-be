/*
  Warnings:

  - Added the required column `status` to the `karyawans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "karyawans" ADD COLUMN     "status" VARCHAR(255) NOT NULL;
