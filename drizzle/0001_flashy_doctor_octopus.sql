CREATE TABLE `classroomMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classroomId` int NOT NULL,
	`userId` int,
	`displayName` varchar(80) NOT NULL,
	`grade` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classroomMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classrooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`inviteCode` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classrooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `classrooms_inviteCode_unique` UNIQUE(`inviteCode`)
);
--> statement-breakpoint
CREATE TABLE `learningEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classroomId` int NOT NULL,
	`memberId` int NOT NULL,
	`lessonId` varchar(100) NOT NULL,
	`eventType` varchar(32) NOT NULL,
	`score` int,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `learningEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `classroomMembers` ADD CONSTRAINT `classroomMembers_classroomId_classrooms_id_fk` FOREIGN KEY (`classroomId`) REFERENCES `classrooms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classroomMembers` ADD CONSTRAINT `classroomMembers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learningEvents` ADD CONSTRAINT `learningEvents_classroomId_classrooms_id_fk` FOREIGN KEY (`classroomId`) REFERENCES `classrooms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learningEvents` ADD CONSTRAINT `learningEvents_memberId_classroomMembers_id_fk` FOREIGN KEY (`memberId`) REFERENCES `classroomMembers`(`id`) ON DELETE no action ON UPDATE no action;