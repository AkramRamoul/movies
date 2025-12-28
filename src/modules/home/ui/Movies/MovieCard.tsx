"use client";

import { EyeIcon, HeartIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FavouriteMovie,
  isFavouriteMovie,
  RemoveFromFavouriteMovies,
  isWatched,
  unWatchMovie,
  markMovieAsWatched,
} from "@/actions/movies";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Dropdown } from "@/components/MovieDropDown";

interface MovieCardProps {
  title: string;
  poster: string;
  Id: string;
}

const LetterboxdMovieCard: React.FC<MovieCardProps> = ({
  title,
  poster,
  Id,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const fetchState = async () => {
      const exists = await isFavouriteMovie(Id, userId!);
      setLiked(exists);
    };
    fetchState();
  }, [Id, userId]);
  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      await RemoveFromFavouriteMovies(Id, userId!);
    } else {
      setLiked(true);
      await FavouriteMovie(Id, userId!);
    }
  };
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    const fetchisWatched = async () => {
      const exists = await isWatched(Id, userId!);
      setWatched(exists);
    };
    fetchisWatched();
  }, [Id, userId]);

  const handleWatchClick = async () => {
    if (watched) {
      setWatched(false);
      await unWatchMovie(Id, userId!);
    } else {
      setWatched(true);
      await markMovieAsWatched(Id, userId!);
    }
  };

  return (
    <Link
      href={`/film/${Id}`}
      className={cn(
        "relative block w-full aspect-2/3 rounded-sm overflow-hidden",
        "border border-white/10 hover:border-amber-50",
        "shadow-md hover:shadow-lg transition"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image src={poster} alt={title} fill className="object-cover" />

      <div
        className={`absolute inset-0 bg-black/70 opacity-0 ${
          isHovered ? "opacity-100" : ""
        } transition-opacity duration-200 flex items-end p-2`}
      >
        {status === "authenticated" && (
          <div
            className={`absolute bottom-0 left-0 right-0 px-2 py-1 
          bg-black/75 backdrop-blur-sm 
          flex items-center justify-around 
          opacity-0 ${isHovered ? "opacity-100 translate-y-0" : "translate-y-3"}
          transition-all duration-200`}
          >
            <EyeIcon
              className={`text-white w-5 h-5 hover:scale-110 transition-transform ${
                watched ? "fill-green-600" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWatchClick();
              }}
            />

            <HeartIcon
              className={`w-5 h-5 hover:scale-110 transition-transform ${
                liked ? "fill-red-500" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike();
              }}
            />

            <Dropdown
              movieId={Id}
              userId={session.user.id}
              poster={poster}
              title={title}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default LetterboxdMovieCard;
