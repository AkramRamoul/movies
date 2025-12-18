"use client";
import {
  FavouriteMovie,
  isFavouriteMovie,
  RemoveFromFavouriteMovies,
} from "@/actions/movies";
import { HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";

const LikeMovie = ({
  userId,
  movieId,
  size,
}: {
  userId: string;
  movieId: string;
  size?: string;
}) => {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const fetchState = async () => {
      const exists = await isFavouriteMovie(movieId, userId!);
      setLiked(exists);
    };
    fetchState();
  }, [movieId, userId]);
  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      await RemoveFromFavouriteMovies(movieId, userId!);
    } else {
      setLiked(true);
      await FavouriteMovie(movieId, userId!);
    }
  };
  return (
    <HeartIcon
      className={` hover:scale-110 transition-transform ${
        liked ? "fill-red-500" : ""
      } ${size ? `w-${size} h-${size}` : "h-5 w-5"}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLike();
      }}
    />
  );
};

export default LikeMovie;
