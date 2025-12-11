"use server";

import { db } from "@/db/drizzle";
import {
  ReviewsTable,
  WatchList,
  FavouriteMovies,
  WatchedMovies,
} from "@/db/schema";
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

export const FavouriteMovie = async (movieId: string, userId: string) => {
  try {
    await db.insert(FavouriteMovies).values({
      userId,
      movieId,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const isFavouriteMovie = async (movieId: string, userId: string) => {
  try {
    const result = await db
      .select()
      .from(FavouriteMovies)
      .where(
        and(
          eq(FavouriteMovies.movieId, movieId),
          eq(FavouriteMovies.userId, userId)
        )
      )
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const RemoveFromFavouriteMovies = async (
  movieId: string,
  userId: string
) => {
  try {
    await db
      .delete(FavouriteMovies)
      .where(
        and(
          eq(FavouriteMovies.movieId, movieId),
          eq(FavouriteMovies.userId, userId)
        )
      );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const markMovieAsWatched = async (movieId: string, userId: string) => {
  try {
    await db.insert(WatchedMovies).values({
      userId,
      movieId,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const unWatchMovie = async (movieId: string, userId: string) => {
  try {
    await db
      .delete(WatchedMovies)
      .where(
        and(
          eq(WatchedMovies.movieId, movieId),
          eq(WatchedMovies.userId, userId)
        )
      );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const isWatched = async (movieId: string, userId: string) => {
  try {
    const result = await db
      .select()
      .from(WatchedMovies)
      .where(
        and(
          eq(WatchedMovies.movieId, movieId),
          eq(WatchedMovies.userId, userId)
        )
      )
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export async function isReviewed(movieId: string, userId: string) {
  const review = await db
    .select({
      id: ReviewsTable.id,
    })
    .from(ReviewsTable)
    .where(
      and(eq(ReviewsTable.userId, userId), eq(ReviewsTable.movieId, movieId))
    )
    .limit(1);

  // Return true if any row exists
  return review.length > 0;
}

export const getMovieReviews = async (movieId: string) => {
  const ratings = await db
    .select({
      rating: ReviewsTable.rating,
    })
    .from(ReviewsTable)
    .where(eq(ReviewsTable.movieId, movieId));

  // 1. Initialize counts
  const counts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // 2. Count occurrences
  ratings.forEach((r) => {
    const value = Number(r.rating);
    if (counts[value] !== undefined) {
      counts[value]++;
    }
  });

  // 3. Compute percentages
  const total = ratings.length;
  const percentages: Record<number, number> = {
    1: total ? Math.round((counts[1] / total) * 100) : 0,
    2: total ? Math.round((counts[2] / total) * 100) : 0,
    3: total ? Math.round((counts[3] / total) * 100) : 0,
    4: total ? Math.round((counts[4] / total) * 100) : 0,
    5: total ? Math.round((counts[5] / total) * 100) : 0,
  };

  return {
    counts,
    percentages,
    total,
  };
};
