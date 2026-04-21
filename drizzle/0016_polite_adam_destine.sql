CREATE TABLE `community_hub` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`bannerUrl` text,
	`membersCount` int DEFAULT 0,
	`postsCount` int DEFAULT 0,
	`eventsCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_hub_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`userId` int NOT NULL,
	`status` enum('enrolled','completed','cancelled') DEFAULT 'enrolled',
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`certificateUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`courseType` enum('primeira_comunhao','noivos','crisma','palestra','retiro','outro') NOT NULL,
	`price` decimal(10,2) DEFAULT '0',
	`duration` int,
	`maxParticipants` int,
	`instructorId` int,
	`startDate` timestamp,
	`endDate` timestamp,
	`imageUrl` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `instrument_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`ministryId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`instrumentType` varchar(100) NOT NULL,
	`brand` varchar(100),
	`condition` enum('novo','otimo','bom','regular') NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` text,
	`location` varchar(255),
	`state` varchar(2),
	`status` enum('ativo','vendido','removido') DEFAULT 'ativo',
	`viewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `instrument_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplace_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`senderId` int NOT NULL,
	`receiverId` int NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `marketplace_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retreat_songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`retreatId` int NOT NULL,
	`songId` int NOT NULL,
	`moment` enum('abertura','reflexao','louvor','comunhao','encerramento','outro'),
	`order` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `retreat_songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `retreats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`churchId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`retreatType` enum('espiritual','musical','juventude','familias','outro') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`location` varchar(255),
	`coordinatorId` int,
	`maxParticipants` int,
	`price` decimal(10,2) DEFAULT '0',
	`imageUrl` text,
	`playlistId` int,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `retreats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seller_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`buyerId` int NOT NULL,
	`listingId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seller_ratings_id` PRIMARY KEY(`id`)
);
