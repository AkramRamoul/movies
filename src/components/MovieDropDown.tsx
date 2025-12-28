"use client";

import Modal from "@/components/modal";
import LogMovie from "@/modules/Log/LogMovie";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import {
  addToWatchList,
  isInWatchList,
  RemoveFromWatchList,
  alreadyReviewed,
  getUserMovieReview,
} from "@/actions/movies";
import { MoreHorizontalIcon } from "lucide-react";

export const Dropdown = ({
  movieId,
  userId,
  poster,
  title,
}: {
  movieId: string;
  userId: string;
  poster?: string;
  title: string;
}) => {
  const [inWatchList, setInWatchList] = useState<boolean | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialReviewData, setInitialReviewData] = useState<any>(null);

  useEffect(() => {
    const fetchState = async () => {
      const exists = await isInWatchList(movieId, userId);
      setInWatchList(exists);
    };
    fetchState();
  }, [movieId, userId]);
  const [loading, setLoading] = useState(false);
  const [editReviewOpen, setEditReviewOpen] = useState(false);

  const toggleWatchList = async () => {
    if (loading || inWatchList === null) return;
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
  const [isReviewd, setIsReviewed] = useState(false);
  useEffect(() => {
    const CheckReview = async () => {
      const reviewed = await alreadyReviewed(movieId, userId);
      if (reviewed) {
        setIsReviewed(true);
      }
    };
    CheckReview();
  }, [movieId, userId]);

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
            poster={poster}
            onSave={() => setIsOpenModal(false)}
            title={title}
          />
        </Modal>
      )}
      {editReviewOpen && (
        <Modal
          isOpen={editReviewOpen}
          onClose={() => {
            setEditReviewOpen(false);
          }}
        >
          <LogMovie
            movieId={movieId}
            userId={userId}
            poster={poster}
            onSave={() => setIsOpenModal(false)}
            title={title}
            initialData={initialReviewData}
          />
        </Modal>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="More Options"
            className="text-white w-5 h-5 hover:scale-110 transition-transform
      bg-transparent hover:bg-transparent border-none"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWatchList();
              }}
              className="flex justify-center"
            >
              {inWatchList ? "Remove from watchlist" : "Add to watchlist"}
            </DropdownMenuItem>

            {isReviewd ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex justify-center">
                  Log again/edit review
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpenModal(true);
                      }}
                    >
                      Review or log film again..
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const review = await getUserMovieReview(
                          movieId,
                          userId
                        );
                        const initialReview = {
                          review: review.review ?? "",
                          rating: review.rating ?? 0,
                          watched: true,
                          watchedDate: new Date(),
                          reWatched: false,
                        };
                        if (review) {
                          setInitialReviewData(initialReview);
                        }

                        setEditReviewOpen(true);
                      }}
                    >
                      Edit review
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem
                className="flex justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpenModal(true);
                }}
              >
                Review or log film
              </DropdownMenuItem>
            )}
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
