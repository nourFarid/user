/*
  Warnings:

  - The primary key for the `card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `duoDate` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vistorsNumber` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `card` DROP PRIMARY KEY,
    ADD COLUMN `duoDate` DATETIME(3) NOT NULL,
    ADD COLUMN `platform` VARCHAR(191) NOT NULL,
    ADD COLUMN `vistorsNumber` BIGINT NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Voucher` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `price` DOUBLE NOT NULL,
    `photo` VARCHAR(191) NOT NULL,
    `cardId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Voucher` ADD CONSTRAINT `Voucher_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
