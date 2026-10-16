-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `amount` DECIMAL(10, 2) NULL,
    ADD COLUMN `currency` VARCHAR(191) NULL,
    ADD COLUMN `gatewayPaymentId` VARCHAR(191) NULL,
    ADD COLUMN `method` VARCHAR(191) NOT NULL DEFAULT 'slip',
    ADD COLUMN `orderId` VARCHAR(191) NULL,
    MODIFY `slipImage` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_orderId_key` ON `Payment`(`orderId`);

