"use server";

import { db } from "@/db/drizzle";
import {
  ReviewsTable,
  WatchList,
  FavouriteMovies,
  WatchedMovies,
  diaryEntries,
} from "@/db/schema";
import { UserFilmStats } from "@/types/types";
import { and, count, desc, eq, gte } from "drizzle-orm";

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

    await logActivity({
      userId,
      movieId,
      activityType: "watchlist_add",
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
  reviewText: string,
  rewatch?: boolean
) => {
  try {
    await db.insert(ReviewsTable).values({
      movieId,
      rating,
      userId,
      reviewText,
    });

    await logActivity({
      userId,
      movieId,
      activityType: rewatch ? "rewatched" : "reviewed",
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

    await logActivity({
      userId,
      movieId,
      activityType: "liked",
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

    await logActivity({
      userId,
      movieId,
      activityType: "watched",
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

  return {
    counts,
    total,
  };
};

export const getUserFilmStats = async (
  userId: string
): Promise<UserFilmStats> => {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);

  const [watched, watchedThisYear, reviewed, liked] = await Promise.all([
    // all watched
    db
      .select({ movieId: WatchedMovies.movieId })
      .from(WatchedMovies)
      .where(eq(WatchedMovies.userId, userId)),

    // watched THIS YEAR
    db
      .select({ movieId: WatchedMovies.movieId })
      .from(WatchedMovies)
      .where(eq(WatchedMovies.userId, userId)),

    // reviewed
    db
      .select({ movieId: WatchedMovies.movieId })
      .from(WatchedMovies)
      .where(
        and(
          eq(WatchedMovies.userId, userId),
          gte(WatchedMovies.watchedAt, startOfYear)
        )
      ),

    // liked
    db
      .select({ movieId: FavouriteMovies.movieId })
      .from(FavouriteMovies)
      .where(eq(FavouriteMovies.userId, userId)),
  ]);

  const watchedSet = new Set(watched.map((m) => m.movieId));
  const reviewedSet = new Set(reviewed.map((m) => m.movieId));
  const likedSet = new Set(liked.map((m) => m.movieId));
  const thisYearSet = new Set(watchedThisYear.map((m) => m.movieId));

  // total films = union of all categories
  const totalFilmsSet = new Set([...watchedSet, ...reviewedSet, ...likedSet]);

  return {
    totalFilms: totalFilmsSet.size,
    filmsThisYear: thisYearSet.size,
    watchedCount: watchedSet.size,
    reviewedCount: reviewedSet.size,
    likedCount: likedSet.size,
  };
};

export const AddDiaryEntry = async (
  movieId: string,
  userId: string,
  date: Date | undefined,
  rewatch: boolean
) => {
  await db.insert(diaryEntries).values({
    userId,
    movieId,
    date: date!,
    rewatch,
  });
};

export const alreadyReviewed = async (movieId: string, userId: string) => {
  const review = await db
    .select()
    .from(ReviewsTable)
    .where(
      and(eq(ReviewsTable.userId, userId), eq(ReviewsTable.movieId, movieId))
    )
    .limit(1);
  if (review.length > 0) {
    return true;
  }
  return false;
};

export const updateMovieReview = async (
  movieId: string,
  userId: string,
  rating: number,
  reviewText: string
) => {
  try {
    await db
      .update(ReviewsTable)
      .set({
        rating,
        reviewText,
      })
      .where(
        and(eq(ReviewsTable.userId, userId), eq(ReviewsTable.movieId, movieId))
      );
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export async function getUserMovieReview(movieId: string, userId: string) {
  const result = await db
    .select({
      rating: ReviewsTable.rating,
      review: ReviewsTable.reviewText,
    })
    .from(ReviewsTable)
    .leftJoin(
      diaryEntries,
      and(
        eq(diaryEntries.movieId, ReviewsTable.movieId),
        eq(diaryEntries.userId, ReviewsTable.userId)
      )
    )
    .where(
      and(eq(ReviewsTable.movieId, movieId), eq(ReviewsTable.userId, userId))
    )
    .limit(1);

  return result[0] ?? null;
}

export async function getFavMoviesByUser(userId: string) {
  const result = await db
    .select({
      movieId: FavouriteMovies.movieId,
    })
    .from(FavouriteMovies)
    .where(eq(FavouriteMovies.userId, userId))
    .limit(4);

  return result;
}
export async function getAllFavMoviesByUser(userId: string) {
  const result = await db
    .select({
      movieId: FavouriteMovies.movieId,
    })
    .from(FavouriteMovies)
    .where(eq(FavouriteMovies.userId, userId));

  return result;
}

import { ActivityLog } from "@/db/schema";

async function logActivity({
  userId,
  activityType,
  movieId,
}: {
  userId: string;
  activityType: string;
  movieId?: string;
}) {
  await db.insert(ActivityLog).values({
    userId,
    activityType,
    movieId,
  });
}
