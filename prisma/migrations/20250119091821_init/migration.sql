/*
  Warnings:

  - You are about to drop the column `type` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `fromAccount` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toAccount` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `transactionhistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountNumber]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountType` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionStatus` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changedBalance` to the `TransactionHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_fromAccount_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_toAccount_fkey`;

-- DropIndex
DROP INDEX `Account_userId_fkey` ON `account`;

-- DropIndex
DROP INDEX `Transaction_fromAccount_fkey` ON `transaction`;

-- DropIndex
DROP INDEX `Transaction_toAccount_fkey` ON `transaction`;

-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `account` DROP COLUMN `type`,
    DROP COLUMN `userId`,
    ADD COLUMN `accountType` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerId` INTEGER NOT NULL,
    MODIFY `balance` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `fromAccount`,
    DROP COLUMN `timestamp`,
    DROP COLUMN `toAccount`,
    ADD COLUMN `fromAccountId` INTEGER NULL,
    ADD COLUMN `toAccountId` INTEGER NULL,
    ADD COLUMN `transactionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `transactionStatus` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transactionhistory` DROP COLUMN `status`,
    ADD COLUMN `changedBalance` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'customer',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cifNumber` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,

    UNIQUE INDEX `Customer_userId_key`(`userId`),
    UNIQUE INDEX `Customer_cifNumber_key`(`cifNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Account_accountNumber_key` ON `Account`(`accountNumber`);

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_fromAccountId_fkey` FOREIGN KEY (`fromAccountId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_toAccountId_fkey` FOREIGN KEY (`toAccountId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
