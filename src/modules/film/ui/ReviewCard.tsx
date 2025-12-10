"use client";

import {
  addToWatchList,
  FavouriteMovie,
  isFavouriteMovie,
  isInWatchList,
  isWatched,
  markMovieAsWatched,
  RemoveFromFavouriteMovies,
  RemoveFromWatchList,
  unWatchMovie,
} from "@/actions/movies";
import { Clock, EyeIcon, HeartIcon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  userId: string;
  MovieId: string;
  reviewed: boolean;
}

const ReviewCard = ({ userId, MovieId, reviewed }: Props) => {
  const [inWatchList, setInWatchList] = useState(false);

  useEffect(() => {
    const fetchisWatched = async () => {
      const exists = await isInWatchList(MovieId, userId!);
      setInWatchList(exists);
    };
    fetchisWatched();
  }, [MovieId, userId]);

  const toggleWatchList = async () => {
    if (inWatchList) {
      setInWatchList(false);
      await RemoveFromWatchList(MovieId, userId);
    } else {
      setInWatchList(true);
      await addToWatchList(MovieId, userId);
    }
  };
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    const fetchisWatched = async () => {
      const exists = await isWatched(MovieId, userId!);
      setWatched(exists);
    };
    fetchisWatched();
  }, [MovieId, userId]);

  const handleWatchClick = async () => {
    if (watched) {
      setWatched(false);
      await unWatchMovie(MovieId, userId);
    } else {
      setWatched(true);
      await markMovieAsWatched(MovieId, userId);
    }
  };

  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const fetchState = async () => {
      const exists = await isFavouriteMovie(MovieId, userId!);
      setLiked(exists);
    };
    fetchState();
  }, [MovieId, userId]);
  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      await RemoveFromFavouriteMovies(MovieId, userId!);
    } else {
      setLiked(true);
      await FavouriteMovie(MovieId, userId!);
    }
  };
  return (
    <div className="bg-gray-700 rounded-md p-4 flex flex-col gap-2 w-80 h-65">
      <div className="flex justify-between items-center">
        <button
          onClick={handleWatchClick}
          className="flex flex-col items-center gap-2 text-gray-300 hover:text-white group"
        >
          <EyeIcon
            className={`h-7 w-7 transition-transform group-hover:scale-110 ${
              watched ? "text-green-500" : ""
            }`}
          />
          <span className={`${watched ? "group-hover:hidden" : ""}`}>
            {watched ? "Watched" : "Watch"}
          </span>
          {watched && (
            <span className="hidden group-hover:block text-red-400">
              Remove
            </span>
          )}
        </button>

        <button
          className="flex flex-col items-center gap-2 text-gray-300 hover:text-white group"
          onClick={handleLike}
        >
          <HeartIcon
            className={`w-7 h-7 hover:scale-110 transition-transform ${
              liked ? "fill-red-500" : ""
            }`}
          />{" "}
          <span className={`${liked ? "group-hover:hidden" : ""}`}>
            {liked ? "Liked" : "Like"}
          </span>
          {liked && (
            <span className="hidden group-hover:block text-red-400">
              Remove
            </span>
          )}
        </button>
        <button
          className="flex flex-col items-center gap-2 text-gray-300 hover:text-white group"
          onClick={toggleWatchList}
        >
          <Clock
            className={`w-7 h-7 hover:scale-110 transition-transform ${
              inWatchList ? "text-[#40bbf5]" : ""
            }`}
          />{" "}
          <span className={`${inWatchList ? "group-hover:hidden" : ""}`}>
            Watchlist
          </span>
          {inWatchList && (
            <span className="hidden group-hover:block text-red-400">
              Remove
            </span>
          )}
        </button>
      </div>
      <div className="flex justify-center gap-1 text-gray-400 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="w-5 h-5" />
        ))}
      </div>
      <div className="flex flex-col gap-1 mt-2 text-gray-300">
        <button
          className="
          flex justify-center items-center
          text-gray-300 hover:text-white
          border-t border-gray-600 p-2
        "
        >
          Show your activity
        </button>
        <button
          className="
           flex justify-center items-center
          text-gray-300 hover:text-white
          border-t border-gray-600 p-2
        "
        >
          {reviewed ? "Edit Review" : "Review Movie"}
        </button>
        <button
          className="
         flex justify-center p-2 items-center
          text-gray-300 hover:text-white
          border-t border-gray-600
        "
        >
          Add to lists...
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
