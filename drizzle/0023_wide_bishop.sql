CREATE TABLE `ministries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`maestroName` varchar(255),
	`maestroEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ministries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ministryMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ministryId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`role` varchar(100) NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ministryMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ministries` ADD CONSTRAINT `ministries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ministryMembers` ADD CONSTRAINT `ministryMembers_ministryId_ministries_id_fk` FOREIGN KEY (`ministryId`) REFERENCES `ministries`(`id`) ON DELETE no action ON UPDATE no action;