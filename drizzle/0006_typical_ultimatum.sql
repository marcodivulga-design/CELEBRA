CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`eventName` varchar(255) NOT NULL,
	`userId` int,
	`sessionId` varchar(255),
	`source` varchar(100),
	`referrer` text,
	`userAgent` text,
	`ipAddress` varchar(45),
	`pageUrl` text,
	`pageTitle` varchar(255),
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversion_funnel_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stepName` varchar(100) NOT NULL,
	`stepOrder` int NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`userId` int,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversion_funnel_steps_id` PRIMARY KEY(`id`)
);
