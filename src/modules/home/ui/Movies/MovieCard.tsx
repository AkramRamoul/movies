"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EyeIcon, HeartIcon, MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  addToWatchList,
  RemoveFromWatchList,
  isInWatchList,
  FavouriteMovie,
  isFavouriteMovie,
  RemoveFromFavouriteMovies,
  isWatched,
  unWatchMovie,
  markMovieAsWatched,
} from "@/actions/movies";
import Modal from "@/components/modal";
import LogMovie from "@/modules/Log/LogMovie";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  title: string;
  poster: string;
  Id: string;
  width?: string;
  height?: string;
}

const LetterboxdMovieCard: React.FC<MovieCardProps> = ({
  title,
  poster,
  Id,
  width,
  height,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const userId = user?.id;

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

  if (!isLoaded) {
    return <div className="hidden">Loading...</div>;
  }
  return (
    <Link
      href={`/film/${Id}`}
      className={cn(
        "rounded-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border hover:border-2 hover:border-amber-50 shrink-0",
        width ?? "w-35",
        height ?? "h-[220px]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full">
        <Image src={poster} alt={title} fill className="object-cover" />
        <div
          className={`absolute inset-0 bg-black/70 opacity-0 ${
            isHovered ? "opacity-100" : ""
          } transition-opacity duration-200 flex items-end p-2`}
        >
          {isSignedIn && (
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
                onClick={handleWatchClick}
              />
              <HeartIcon
                className={`w-5 h-5 hover:scale-110 transition-transform ${
                  liked ? "fill-red-500" : ""
                }`}
                onClick={handleLike}
              />
              <Dropdown movieId={Id} userId={user.id} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LetterboxdMovieCard;

const Dropdown = ({ movieId, userId }: { movieId: string; userId: string }) => {
  const [inWatchList, setInWatchList] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      const exists = await isInWatchList(movieId, userId);
      setInWatchList(exists);
    };
    fetchState();
  }, [movieId, userId]);
  const [loading, setLoading] = useState(false);

  const toggleWatchList = async () => {
    if (loading || inWatchList === null) return; // prevent double clicks
    setLoading(true);

    setInWatchList(!inWatchList);

    try {
      if (inWatchList) {
        await RemoveFromWatchList(movieId, userId);
      } else {
        await addToWatchList(movieId, userId);
      }
    } catch (err) {
      setInWatchList(inWatchList);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const [open, setOpen] = useState(false);
  const [modalisOpen, setIsOpenModal] = useState(false);

  return (
    <div>
      {modalisOpen && (
        <Modal
          isOpen={modalisOpen}
          onClose={() => {
            setIsOpenModal(false);
          }}
        >
          <LogMovie
            movieId={movieId}
            userId={userId}
            onSave={() => setIsOpenModal(false)}
          />
        </Modal>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="More Options"
            className="text-white w-5 h-5 hover:scale-110 transition-transform
            bg-transparent hover:bg-transparent bg-none border-none
            "
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52"
          onMouseLeave={() => setOpen(false)}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={toggleWatchList}
              className="flex justify-center"
            >
              {inWatchList ? "Remove from watchlist" : "Add to watchlist"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex justify-center"
              onClick={() => setIsOpenModal(true)}
            >
              Review or Log
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex justify-center">
              Show in lists
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-center">
              Add to lists
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
