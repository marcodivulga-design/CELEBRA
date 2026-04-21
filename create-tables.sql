-- Create celebrations table
CREATE TABLE IF NOT EXISTS `celebrations` (
  `id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `date` timestamp NOT NULL,
  `type` enum('missa','palavra','batizado','casamento','funeral','vigilia','outro') NOT NULL DEFAULT 'missa',
  `location` varchar(255),
  `status` enum('draft','scheduled','completed','cancelled') NOT NULL DEFAULT 'draft',
  `createdBy` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `celebrations_id` PRIMARY KEY(`id`),
  CONSTRAINT `celebrations_createdBy_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Create celebrationSongs table
CREATE TABLE IF NOT EXISTS `celebrationSongs` (
  `id` int AUTO_INCREMENT NOT NULL,
  `celebrationId` int NOT NULL,
  `songId` int NOT NULL,
  `order` int NOT NULL,
  `moment` varchar(100),
  `transposition` int DEFAULT 0,
  `title` varchar(255),
  `artist` varchar(255),
  `lyrics` text,
  `chords` text,
  CONSTRAINT `celebrationSongs_id` PRIMARY KEY(`id`),
  CONSTRAINT `celebrationSongs_celebrationId_fk` FOREIGN KEY (`celebrationId`) REFERENCES `celebrations`(`id`) ON DELETE CASCADE,
  CONSTRAINT `celebrationSongs_songId_fk` FOREIGN KEY (`songId`) REFERENCES `songs`(`id`) ON DELETE CASCADE
);

-- Create readings table
CREATE TABLE IF NOT EXISTS `readings` (
  `id` int AUTO_INCREMENT NOT NULL,
  `celebrationId` int NOT NULL,
  `book` varchar(100) NOT NULL,
  `chapter` int NOT NULL,
  `verseStart` int NOT NULL,
  `verseEnd` int,
  `type` enum('primeira','segunda','evangelho','salmo','outro') NOT NULL,
  `text` text,
  `reader` varchar(255),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `readings_id` PRIMARY KEY(`id`),
  CONSTRAINT `readings_celebrationId_fk` FOREIGN KEY (`celebrationId`) REFERENCES `celebrations`(`id`) ON DELETE CASCADE
);

-- Create teams table
CREATE TABLE IF NOT EXISTS `teams` (
  `id` int AUTO_INCREMENT NOT NULL,
  `celebrationId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `teams_id` PRIMARY KEY(`id`),
  CONSTRAINT `teams_celebrationId_fk` FOREIGN KEY (`celebrationId`) REFERENCES `celebrations`(`id`) ON DELETE CASCADE
);

-- Create teamMembers table
CREATE TABLE IF NOT EXISTS `teamMembers` (
  `id` int AUTO_INCREMENT NOT NULL,
  `teamId` int NOT NULL,
  `ministryMemberId` int NOT NULL,
  `role` varchar(100) NOT NULL,
  CONSTRAINT `teamMembers_id` PRIMARY KEY(`id`),
  CONSTRAINT `teamMembers_teamId_fk` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE CASCADE,
  CONSTRAINT `teamMembers_ministryMemberId_fk` FOREIGN KEY (`ministryMemberId`) REFERENCES `ministryMembers`(`id`) ON DELETE CASCADE
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS `organizations` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `description` text,
  `plan` enum('free','pro','enterprise') NOT NULL DEFAULT 'free',
  `ownerId` int NOT NULL,
  `logo` varchar(255),
  `website` varchar(255),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
  CONSTRAINT `organizations_ownerId_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Create organizationUsers table
CREATE TABLE IF NOT EXISTS `organizationUsers` (
  `id` int AUTO_INCREMENT NOT NULL,
  `organizationId` int NOT NULL,
  `userId` int NOT NULL,
  `role` enum('owner','admin','member') NOT NULL DEFAULT 'member',
  `joinedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `organizationUsers_id` PRIMARY KEY(`id`),
  CONSTRAINT `organizationUsers_organizationId_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE CASCADE,
  CONSTRAINT `organizationUsers_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX `celebrations_date_idx` ON `celebrations`(`date`);
CREATE INDEX `celebrations_createdBy_idx` ON `celebrations`(`createdBy`);
CREATE INDEX `celebrationSongs_celebrationId_idx` ON `celebrationSongs`(`celebrationId`);
CREATE INDEX `readings_celebrationId_idx` ON `readings`(`celebrationId`);
CREATE INDEX `teams_celebrationId_idx` ON `teams`(`celebrationId`);
CREATE INDEX `organizationUsers_organizationId_idx` ON `organizationUsers`(`organizationId`);
CREATE INDEX `organizationUsers_userId_idx` ON `organizationUsers`(`userId`);
