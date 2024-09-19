/*
  Warnings:

  - Added the required column `photo` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `card` ADD COLUMN `photo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `photo` VARCHAR(191) NOT NULL;
