CREATE TABLE `choir_parts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`songId` int NOT NULL,
	`voicePart` varchar(50) NOT NULL,
	`audioUrl` text,
	`sheetMusicUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `choir_parts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `churches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`patronSaint` varchar(255),
	`diocese` varchar(255),
	`city` varchar(255),
	`state` varchar(2),
	`logoUrl` text,
	`primaryColor` varchar(7) DEFAULT '#7C3AED',
	`secondaryColor` varchar(7) DEFAULT '#6D28D9',
	`plan` enum('free','basic','intermediate','premium') NOT NULL DEFAULT 'free',
	`credits` int NOT NULL DEFAULT 0,
	`ownerId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `churches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `credit_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`amount` int NOT NULL,
	`description` varchar(255),
	`transactionType` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `credit_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`blockName` varchar(100) NOT NULL,
	`blockOrder` int NOT NULL,
	`songId` int,
	`transposeKey` varchar(10),
	`notes` text,
	CONSTRAINT `event_blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`title` varchar(255),
	`eventDate` timestamp NOT NULL,
	`eventType` varchar(50) DEFAULT 'missa',
	`liturgicalCycle` varchar(5),
	`liturgicalTime` varchar(100),
	`liturgicalColor` varchar(20),
	`notes` text,
	`pdfUrl` text,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`artist` varchar(255),
	`lyrics` text,
	`chords` text,
	`originalKey` varchar(10),
	`bpm` int,
	`difficultyLevel` int DEFAULT 1,
	`liturgicalTime` varchar(100),
	`massMoment` varchar(100),
	`theme` varchar(255),
	`isPublic` boolean NOT NULL DEFAULT true,
	`churchId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `churchId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `voicePart` varchar(50);