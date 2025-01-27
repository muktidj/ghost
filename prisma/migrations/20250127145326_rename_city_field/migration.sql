/*
  Warnings:

  - You are about to drop the column `City` on the `Products` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Products` DROP COLUMN `City`,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `duration` INTEGER NOT NULL,
    MODIFY `province` VARCHAR(191) NULL;
