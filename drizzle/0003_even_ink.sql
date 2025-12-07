CREATE TABLE "watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
