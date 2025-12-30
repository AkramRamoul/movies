import { getRecentActivity } from "@/actions/movies";
import { getCurrentUser } from "@/actions/user";

import AtctivityNav from "@/modules/activity/ActivityNav";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { fetchMovie } from "@/modules/profile/lib/fetch";
import Image from "next/image";
import { eq } from "drizzle-orm";
import { HeartIcon, TextAlignStart } from "lucide-react";
const page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const [profileUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const user = await getCurrentUser();

  const data = await getRecentActivity(user!.id);

  if (!data || data.length === 0) {
    return null;
  }

  const activityWithMovie = (
    await Promise.all(
      data.map(async (activity) => {
        const movie = await fetchMovie(activity.movieId!);
        if (!movie) return null;

        return {
          activity,
          movie,
        };
      })
    )
  ).filter((item): item is NonNullable<typeof item> => item !== null);

  const seen = new Set<string>();

  const uniqueActivities = activityWithMovie.filter(({ movie }) => {
    if (seen.has(movie.imdbID)) return false;
    seen.add(movie.imdbID);
    return true;
  });

  return (
    <div className="max-w-7xl h-screen mx-auto px-auto px-6 md:px-50 bg-noise">
      <AtctivityNav profileUser={profileUser} username={username} />
      <h1 className="text-base mt-6 text-[#99a9ba] uppercase tracking-widest">
        Watched
      </h1>
      <hr className="border-[#404e61] mt-2 mb-4" />
      <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(95px,1fr))]">
        {uniqueActivities.map(({ movie, activity }) => (
          <div key={movie.imdbID} className="flex flex-col items-start">
            <Image
              src={movie.Poster ?? "/Avatar.png"}
              alt={movie.Title}
              width={95}
              height={120}
              className="rounded-sm object-cover"
            />

            {/* Reserved space */}
            <div className="h-4 flex items-center gap-2 mt-2">
              {activity.rating && (
                <div className="flex items-center gap-0.5 text-xs text-[#657687]">
                  {Array.from({ length: activity.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              )}

              {!!activity.isLiked && (
                <HeartIcon className="w-3 h-3 fill-[#677787] text-[#677787]" />
              )}

              {activity.reviewId && (
                <TextAlignStart className="w-3 h-3 fill-[#677787] text-[#677787]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
