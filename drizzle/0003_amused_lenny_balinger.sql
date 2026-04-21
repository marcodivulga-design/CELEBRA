ALTER TABLE `churches` MODIFY COLUMN `credits` int NOT NULL DEFAULT 10;--> statement-breakpoint
ALTER TABLE `churches` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);