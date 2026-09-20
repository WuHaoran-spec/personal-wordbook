CREATE TABLE `lookup_usage` (
	`owner_id` text PRIMARY KEY NOT NULL,
	`minute` integer NOT NULL,
	`calls` integer NOT NULL,
	`day` integer NOT NULL,
	`day_calls` integer NOT NULL
);
