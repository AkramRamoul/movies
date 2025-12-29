"use server";

import { db } from "@/db/drizzle";
import {
  ReviewsTable,
  WatchList,
  FavouriteMovies,
  WatchedMovies,
  diaryEntries,
} from "@/db/schema";
import { ActivityType, UserFilmStats } from "@/types/types";
import { and, count, desc, eq, gte, aliasedTable } from "drizzle-orm";

import { ActivityLog } from "@/db/schema";

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
      activityType: "watchlisted",
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
  rating?: number,
  reviewText?: string,
  rewatch?: boolean,
  createdAt?: Date
) => {
  try {
    const isReview = typeof rating === "number" || Boolean(reviewText?.trim());

    // ✅ CASE 1: Rewatch ONLY (no review)
    if (!isReview) {
      await logActivity({
        userId,
        movieId,
        activityType: "rewatched",
        rewatch: true,
      });

      return true;
    }

    // ✅ CASE 2: Review exists → create review
    let reviewId: number | undefined;

    if (isReview) {
      const [review] = await db
        .insert(ReviewsTable)
        .values({
          movieId,
          userId,
          rating,
          reviewText,
          createdAt,
        })
        .returning({ id: ReviewsTable.id });

      reviewId = review.id;

      await logActivity({
        userId,
        movieId,
        activityType: "reviewed",
        reviewId,
        rewatch: Boolean(rewatch),
      });

      return true;
    }
    return false;
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

export async function logActivity({
  userId,
  activityType,
  movieId,
  reviewId,
  rewatch,
}: {
  userId: string;
  activityType: string;
  movieId?: string;
  reviewId?: number;
  rewatch?: boolean;
}) {
  await db.insert(ActivityLog).values({
    userId,
    activityType: activityType as ActivityType,
    movieId,
    reviewId: reviewId,
    rewatch: rewatch,
  });
}

const userFavourites = aliasedTable(FavouriteMovies, "userFavourites");

export const getRecentActivityShort = async (userId: string) => {
  return await db
    .select({
      movieId: ActivityLog.movieId,
      activityType: ActivityLog.activityType,
      rating: ReviewsTable.rating,
      createdAt: ActivityLog.createdAt,
      rewatch: ActivityLog.rewatch,
      isLiked: eq(userFavourites.movieId, ActivityLog.movieId), // boolean if joined
    })
    .from(ActivityLog)
    .leftJoin(ReviewsTable, eq(ActivityLog.reviewId, ReviewsTable.id))
    .leftJoin(
      userFavourites,
      and(
        eq(userFavourites.movieId, ActivityLog.movieId),
        eq(userFavourites.userId, userId)
      )
    )
    .where(eq(ActivityLog.userId, userId))
    .orderBy(desc(ActivityLog.createdAt))
    .limit(4);
};

export const hasUserReviewedMovie = async (movieId: string, userId: string) => {
  const review = await db
    .select()
    .from(ReviewsTable)
    .where(
      and(eq(ReviewsTable.movieId, movieId), eq(ReviewsTable.userId, userId))
    )
    .limit(1);

  return review.length > 0;
};

export const getRecentActivity = async (userId: string) => {
  const twentyOneDaysAgo = new Date();
  twentyOneDaysAgo.setDate(twentyOneDaysAgo.getDate() - 21);

  return await db
    .select({
      movieId: ActivityLog.movieId,
      activityType: ActivityLog.activityType,
      rating: ReviewsTable.rating,
      createdAt: ActivityLog.createdAt,
      rewatch: ActivityLog.rewatch,
      isLiked: eq(userFavourites.movieId, ActivityLog.movieId),
    })
    .from(ActivityLog)
    .leftJoin(ReviewsTable, eq(ActivityLog.reviewId, ReviewsTable.id))
    .leftJoin(
      userFavourites,
      and(
        eq(userFavourites.movieId, ActivityLog.movieId),
        eq(userFavourites.userId, userId)
      )
    )
    .where(
      and(
        eq(ActivityLog.userId, userId),
        gte(ActivityLog.createdAt, twentyOneDaysAgo)
      )
    )
    .orderBy(desc(ActivityLog.createdAt));
};
