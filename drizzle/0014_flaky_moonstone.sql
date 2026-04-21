CREATE TABLE `community_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`likes` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`churchId` int NOT NULL,
	`state` varchar(2),
	`postType` enum('suggestion','report','question','success_story') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`relatedSongId` int,
	`celebrationType` varchar(50),
	`massMoment` varchar(100),
	`likes` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_rankings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`songId` int NOT NULL,
	`state` varchar(2),
	`celebrationType` varchar(50),
	`massMoment` varchar(100),
	`rank` int,
	`score` decimal(10,2),
	`period` varchar(50),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_rankings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `song_contributions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`songId` int NOT NULL,
	`contributorId` int NOT NULL,
	`churchId` int NOT NULL,
	`state` varchar(2),
	`celebrationType` varchar(50),
	`massMoment` varchar(100),
	`description` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `song_contributions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `song_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`songId` int NOT NULL,
	`userId` int NOT NULL,
	`churchId` int NOT NULL,
	`state` varchar(2),
	`celebrationType` varchar(50),
	`massMoment` varchar(100),
	`rating` int,
	`comment` text,
	`usageDate` timestamp,
	`worked` boolean,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `song_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `song_usage_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`songId` int NOT NULL,
	`state` varchar(2),
	`celebrationType` varchar(50),
	`massMoment` varchar(100),
	`usageCount` int DEFAULT 0,
	`successRate` decimal(5,2) DEFAULT '0',
	`lastUsedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `song_usage_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profile_community` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`churchId` int NOT NULL,
	`state` varchar(2),
	`bio` text,
	`songsContributed` int DEFAULT 0,
	`feedbackGiven` int DEFAULT 0,
	`postsCreated` int DEFAULT 0,
	`communityScore` int DEFAULT 0,
	`badges` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profile_community_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profile_community_userId_unique` UNIQUE(`userId`)
);
