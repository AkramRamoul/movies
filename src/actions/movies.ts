"use server";

import { db } from "@/db/drizzle";
import { ReviewsTable, WatchList } from "@/db/schema";
import { and, count, desc, eq } from "drizzle-orm";

export const getPopularMovies = async () => {
  const result = await db
    .select({
      movieId: ReviewsTable.movieId,
      reviewCount: count(ReviewsTable.id),
    })
    .from(ReviewsTable)
    .groupBy(ReviewsTable.movieId)
    .orderBy(desc(count(ReviewsTable.id)))
    .limit(6);

  return result;
};

export const getAllPopularMovies = async () => {
  const result = await db
    .select({
      movieId: ReviewsTable.movieId,
      reviewCount: count(ReviewsTable.id),
    })
    .from(ReviewsTable)
    .groupBy(ReviewsTable.movieId)
    .orderBy(desc(count(ReviewsTable.id)));

  return result;
};

export const addToWatchList = async (movieId: string, userId: string) => {
  try {
    await db.insert(WatchList).values({
      userId,
      movieId,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const isInWatchList = async (movieId: string, userId: string) => {
  try {
    const result = await db
      .select()
      .from(WatchList)
      .where(and(eq(WatchList.movieId, movieId), eq(WatchList.userId, userId)))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const RemoveFromWatchList = async (movieId: string, userId: string) => {
  try {
    await db
      .delete(WatchList)
      .where(and(eq(WatchList.movieId, movieId), eq(WatchList.userId, userId)));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createMovieReview = async (
  movieId: string,
  userId: string,
  rating: number,
  reviewText: string
) => {
  try {
    await db.insert(ReviewsTable).values({
      movieId,
      rating,
      userId,
      reviewText,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
