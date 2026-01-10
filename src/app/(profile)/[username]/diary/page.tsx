import { getDiaryEntries } from "@/actions/movies";
import { fetchMovie } from "@/modules/profile/lib/fetch";
import ActivityNav from "@/modules/activity/ActivityNav";
import { StarRating } from "@/components/star-rating";
import { db } from "@/db/drizzle";

import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HeartIcon, RepeatIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const [profileUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const rawEntries = await getDiaryEntries(profileUser.id);

  // Fetch movie details for each entry
  const entries = await Promise.all(
    rawEntries.map(async (entry) => {
      const movie = await fetchMovie(entry.movieId);
      return { ...entry, movie };
    })
  );

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-6 md:px-50 bg-[#14181c] text-white">
      <ActivityNav profileUser={profileUser} username={username} />
      <div className="flex justify-between items-baseline mt-6 mb-2 border-b border-gray-800 pb-2">
        <h3 className="text-[#99a9ba] text-sm tracking-widest font-semibold">
          DIARY
        </h3>
      </div>

      <div className="flex flex-col gap-6">
        {entries.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No diary entries yet.
          </div>
        ) : (
          <table className="w-full text-sm text-[#99aabb]">
            <thead className="py-2 bg-[#1b2229] border-y-2 px-2">
              <tr className="border-b border-[#2c3440] text-left text-xs uppercase tracking-wider">
                <th className="py-2 pl-2 w-12 text-left">Month</th>
                <th className="py-2 pl-2 w-10 text-left">Day</th>
                <th className="py-2">Film</th>
                <th className="py-2 w-20">Released</th>
                <th className="py-2 w-24 text-center">Rating</th>
                <th className="py-2 pl-2 w-10 text-center">Like</th>
                <th className="py-2 pl-2 w-10 text-center">Rewatch</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => {
                const date = new Date(entry.watchedDate);
                const day = date.getDate();
                const prevEntry = index > 0 ? entries[index - 1] : null;
                const prevDate = prevEntry
                  ? new Date(prevEntry.watchedDate)
                  : null;
                const isNewMonth =
                  !prevDate ||
                  date.getMonth() !== prevDate.getMonth() ||
                  date.getFullYear() !== prevDate.getFullYear();
                const isNewYear =
                  !prevDate || date.getFullYear() !== prevDate.getFullYear();

                return (
                  <React.Fragment key={index}>
                    {isNewYear && index > 0 && (
                      /* Separator for new year if needed, usually just header logic */
                      <tr className="h-4"></tr>
                    )}
                    <tr className="border-b border-[#2c3440] hover:bg-[#1b2229] group">
                      <td className="py-3 pl-2 align-middle text-white font-bold text-sm">
                        {isNewMonth
                          ? date.toLocaleString("default", { month: "short" })
                          : ""}
                      </td>

                      <td className="py-3 align-middle pl-2 text-2xl font-light text-[#99aabb]">
                        {day}
                      </td>

                      <td className="py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <Link href={`/film/${entry.movieId}`}>
                            <div className="relative w-9 h-[50px] shrink-0 border border-white/20 hover:border-white transition-colors">
                              {entry.movie?.Poster &&
                              entry.movie.Poster !== "N/A" ? (
                                <Image
                                  src={entry.movie.Poster}
                                  alt={entry.movie.Title || "Poster"}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-[8px]">
                                  No Poster
                                </div>
                              )}
                            </div>
                          </Link>

                          <Link
                            href={`/film/${entry.movieId}`}
                            className="font-bold text-white text-base hover:text-[#40bcf4]"
                          >
                            <h3 className="text-xl">
                              {entry.movie?.Title || entry.movieId}
                            </h3>
                          </Link>
                        </div>
                      </td>

                      <td className="py-3 align-middle text-xs">
                        {entry.movie?.Year}
                      </td>
                      <td className="py-3 align-middle text-center">
                        {entry.rating ? (
                          <div className="flex justify-center">
                            <StarRating rating={entry.rating} />
                          </div>
                        ) : null}
                      </td>
                      <td className="py-3 align-middle text-center">
                        {entry.isLiked ? (
                          <HeartIcon className="w-4 h-4 fill-[#ff8000] text-[#ff8000] mx-auto" />
                        ) : (
                          <HeartIcon className="w-4 h-4 fill-gray-500 text-gray-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 align-middle text-center">
                        {entry.rewatch && (
                          <RepeatIcon className="w-4 h-4 text-[#00e054] mx-auto" />
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default page;
