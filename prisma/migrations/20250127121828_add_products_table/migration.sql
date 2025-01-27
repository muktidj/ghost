-- CreateTable
CREATE TABLE `Products` (
    `id_product` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(255) NOT NULL,
    `City` VARCHAR(191) NULL,
    `province` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `isActive` ENUM('Active', 'Inactive') NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id_product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
