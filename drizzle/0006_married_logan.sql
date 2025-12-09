CREATE TABLE "watchedmovies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"movie_id" text NOT NULL,
	"watched_at" timestamp DEFAULT now()
);
