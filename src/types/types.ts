export type UserFilmStats = {
  totalFilms: number;
  filmsThisYear: number;
  watchedCount: number;
  reviewedCount: number;
  likedCount: number;
};

export interface OmdbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: "True" | "False";
  Error?: string; // Present if Response is "False"
}

export type OmdbError = {
  Response: "False";
  Error: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ACTIVITY_TYPES = ["reviewed", "watched", "liked", "rewatched"] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type Activity = {
  movieId: string | null;
  activityType: "reviewed" | "watched" | "liked" | "rewatched" | "watchlisted";
  rating: number | null;
  createdAt: Date | null;
  rewatch: boolean | null;
  isLiked: unknown;
  dateReviewed: Date | null;
  reviewId: number | null;
};
