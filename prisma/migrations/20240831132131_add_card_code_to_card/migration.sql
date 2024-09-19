/*
  Warnings:

  - Added the required column `cardCode` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `card` ADD COLUMN `cardCode` VARCHAR(191) NOT NULL;
