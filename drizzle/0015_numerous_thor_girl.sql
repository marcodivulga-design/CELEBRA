CREATE TABLE `educational_videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ministryId` int NOT NULL,
	`creatorId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`videoUrl` text NOT NULL,
	`thumbnailUrl` text,
	`videoType` enum('vocal_lesson','guitar_lesson','singing_tips','technique','tutorial','performance','other') NOT NULL,
	`instrument` varchar(100),
	`difficulty` enum('beginner','intermediate','advanced'),
	`duration` int,
	`viewCount` int DEFAULT 0,
	`likeCount` int DEFAULT 0,
	`averageRating` decimal(3,1) DEFAULT '0',
	`isPublished` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `educational_videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ministry_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ministryId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('coordinator','maestro','singer','instrumentalist','volunteer') NOT NULL,
	`voicePart` varchar(50),
	`instrument` varchar(100),
	`photoUrl` text,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ministry_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `music_ministries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`logoUrl` text,
	`bannerUrl` text,
	`coordinatorId` int,
	`membersCount` int DEFAULT 0,
	`songsCount` int DEFAULT 0,
	`eventsCount` int DEFAULT 0,
	`communityScore` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `music_ministries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `video_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`likeCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `video_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `video_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `video_ratings_id` PRIMARY KEY(`id`)
);
