CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_code` text NOT NULL,
	`full_name` text NOT NULL,
	`class_name` text NOT NULL,
	`parent_name` text NOT NULL,
	`phone` text NOT NULL,
	`status` text DEFAULT 'Faol' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_code_unique` ON `students` (`student_code`);
--> statement-breakpoint
CREATE INDEX `students_class_idx` ON `students` (`class_name`);
--> statement-breakpoint
CREATE TABLE `requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ticket_no` text NOT NULL,
	`requester` text NOT NULL,
	`category` text NOT NULL,
	`subject` text NOT NULL,
	`status` text DEFAULT 'Yangi' NOT NULL,
	`priority` text DEFAULT 'O‘rta' NOT NULL,
	`due_date` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `requests_ticket_unique` ON `requests` (`ticket_no`);
--> statement-breakpoint
CREATE INDEX `requests_status_due_idx` ON `requests` (`status`,`due_date`);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`inventory_code` text NOT NULL,
	`item_name` text NOT NULL,
	`room` text NOT NULL,
	`condition` text DEFAULT 'Soz' NOT NULL,
	`priority` text DEFAULT 'Past' NOT NULL,
	`assignee` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_code_unique` ON `inventory` (`inventory_code`);
--> statement-breakpoint
CREATE INDEX `inventory_condition_idx` ON `inventory` (`condition`);
