CREATE TABLE "list" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"movies" text[] DEFAULT Array[]::text[]
);
