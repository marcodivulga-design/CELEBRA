CREATE TABLE `event_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`eventType` varchar(50) DEFAULT 'missa',
	`blocks` text NOT NULL,
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `songs` ADD `style` varchar(100) DEFAULT 'tradicional';