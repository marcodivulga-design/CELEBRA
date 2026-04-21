CREATE TABLE `celebrationSongs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`celebrationId` int NOT NULL,
	`songId` int NOT NULL,
	`order` int NOT NULL,
	`moment` varchar(100),
	`transposition` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `celebrationSongs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `celebrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`date` timestamp NOT NULL,
	`type` varchar(100) NOT NULL,
	`location` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `celebrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`celebrationId` int NOT NULL,
	`book` varchar(100) NOT NULL,
	`chapter` int NOT NULL,
	`verseStart` int NOT NULL,
	`verseEnd` int,
	`type` varchar(50) NOT NULL,
	`text` text,
	`reader` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`ministryMemberId` int NOT NULL,
	`role` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teamMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`celebrationId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `celebrationSongs` ADD CONSTRAINT `celebrationSongs_celebrationId_celebrations_id_fk` FOREIGN KEY (`celebrationId`) REFERENCES `celebrations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `celebrationSongs` ADD CONSTRAINT `celebrationSongs_songId_songs_id_fk` FOREIGN KEY (`songId`) REFERENCES `songs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `celebrations` ADD CONSTRAINT `celebrations_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `readings` ADD CONSTRAINT `readings_celebrationId_celebrations_id_fk` FOREIGN KEY (`celebrationId`) REFERENCES `celebrations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teamMembers` ADD CONSTRAINT `teamMembers_teamId_teams_id_fk` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teamMembers` ADD CONSTRAINT `teamMembers_ministryMemberId_ministryMembers_id_fk` FOREIGN KEY (`ministryMemberId`) REFERENCES `ministryMembers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teams` ADD CONSTRAINT `teams_celebrationId_celebrations_id_fk` FOREIGN KEY (`celebrationId`) REFERENCES `celebrations`(`id`) ON DELETE no action ON UPDATE no action;