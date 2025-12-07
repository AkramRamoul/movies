import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const ReviewsTable = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    movieId: text("movie_id").notNull(), // IMDb ID (tt123...)
    userId: text("user_id").notNull(), // Clerk user ID (string)
    rating: integer("rating"),
    reviewText: text("review_text"),
    isSeeded: boolean("is_seeded").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    uniqueUserMovie: unique("unique_user_movie_review").on(t.userId, t.movieId),
  })
);

export type Review = typeof ReviewsTable.$inferSelect;

export const WatchList = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  movieId: text("movie_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
