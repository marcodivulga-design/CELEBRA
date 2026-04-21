CREATE TABLE `choir_compositions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`sopranoCount` int NOT NULL DEFAULT 0,
	`altoCount` int NOT NULL DEFAULT 0,
	`tenorCount` int NOT NULL DEFAULT 0,
	`bassCount` int NOT NULL DEFAULT 0,
	`averageDifficulty` int NOT NULL DEFAULT 3,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `choir_compositions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custom_repertoire` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`missaType` varchar(100) NOT NULL,
	`moment` varchar(100) NOT NULL,
	`songIds` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `custom_repertoire_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`songId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `voice_compatibility` (
	`id` int AUTO_INCREMENT NOT NULL,
	`songId` int NOT NULL,
	`requiredSopranoCount` int NOT NULL DEFAULT 1,
	`requiredAltoCount` int NOT NULL DEFAULT 1,
	`requiredTenorCount` int NOT NULL DEFAULT 1,
	`requiredBassCount` int NOT NULL DEFAULT 1,
	`minDifficulty` int NOT NULL DEFAULT 1,
	`maxDifficulty` int NOT NULL DEFAULT 5,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `voice_compatibility_id` PRIMARY KEY(`id`)
);
