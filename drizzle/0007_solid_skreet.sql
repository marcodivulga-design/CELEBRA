CREATE TABLE `billing_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`event` varchar(100) NOT NULL,
	`amount` int,
	`planName` varchar(100),
	`status` varchar(50) NOT NULL,
	`psdEventId` varchar(255),
	`errorMessage` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `billing_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`plan` enum('free','basic','intermediate','premium') NOT NULL DEFAULT 'free',
	`status` enum('active','cancelled','past_due','pending') NOT NULL DEFAULT 'active',
	`psdCustomerId` varchar(255),
	`psdSubscriptionId` varchar(255),
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`cancelledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_churchId_unique` UNIQUE(`churchId`)
);
