import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

export const ReviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  movieId: text("movie_id").notNull(), // IMDb ID (tt123...)
  userId: text("user_id").notNull(), // Clerk user ID (string)
  rating: integer("rating"),
  reviewText: text("review_text"),
  isSeeded: boolean("is_seeded").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Review = typeof ReviewsTable.$inferSelect;

export const WatchList = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  movieId: text("movie_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const FavouriteMovies = pgTable("favourutemovies", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  movieId: text("movie_id").notNull(),
});

export const WatchedMovies = pgTable("watchedmovies", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  movieId: text("movie_id").notNull(),
  watchedAt: timestamp("watched_at").defaultNow(),
});

export const List = pgTable("list", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  movies: text("movies")
    .array()
    .default(sql`Array[]::text[]`),
  isPrivate: boolean("isPrivate").default(false),
});

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  username: text("username").notNull().unique(),

  password: text("password").notNull(),
  email: text("email").unique(),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const diaryEntries = pgTable("diaryEntries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  movieId: text("movie_id").notNull(),
  date: timestamp("date").notNull(),
  rewatch: boolean("rewatch").default(false),
});
