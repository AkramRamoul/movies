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
} from "@/actions/movies";
import Modal from "@/components/modal";
import LogMovie from "@/modules/Log/LogMovie";

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
  const { isSignedIn, user } = useUser();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div
      className="bg-gray-900 rounded-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-35 h-[220px] border hover:border-2 hover:border-amber-50 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
            <EyeIcon className="text-white w-5 h-5 hover:scale-110 transition-transform" />
            <HeartIcon className="text-white w-5 h-5 hover:scale-110 transition-transform" />
            <Dropdown movieId={Id} userId={user.id} />
          </div>
        )}
      </div>
    </div>
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
