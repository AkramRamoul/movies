import { getRecentActivityShort } from "@/actions/movies";
import { Separator } from "@/components/ui/separator";
import LetterboxdMovieCard from "@/modules/home/ui/Movies/MovieCard";
import { fetchMovie } from "../lib/fetch";
import { getCurrentUser } from "@/actions/user";
import { HeartIcon, RefreshCcw, TextAlignStart } from "lucide-react";

const RecentActivity = async () => {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id;

  const data = await getRecentActivityShort(userId!);

  if (!data || data.length === 0) {
    return null;
  }
  console.log(data);

  const movies = (
    await Promise.all(data.map((p) => fetchMovie(p.movieId!)))
  ).filter(Boolean);
  return (
    <div>
      <h1 className="text-base mt-6 text-[#99a9ba] uppercase tracking-widest">
        Recent Activity
      </h1>
      <Separator />

      <div className="grid grid-cols-2 md:grid-cols-4 mt-2 gap-x-1.5">
        {data.map((activity, i) => {
          const movie = movies.find((m) => m.imdbID === activity.movieId);

          if (!movie) return null;
          return (
            <div key={i}>
              <LetterboxdMovieCard
                Id={movie.imdbID}
                poster={movie.Poster}
                title={movie.Title}
              />

              <div className="flex items-center gap-3 mt-2">
                {activity?.rating && (
                  <div className="flex items-center gap-0.5 text-lg leading-none text-[#657687]">
                    {Array.from({ length: activity.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                )}
                {Boolean(activity.isLiked) && (
                  <HeartIcon className="w-4 h-4 fill-[#677787]" />
                )}

                {activity?.activityType === "reviewed" && (
                  <TextAlignStart className="w-4 h-4 fill-[#677787]" />
                )}

                {activity?.rewatch && (
                  <RefreshCcw className="w-4 h-4 text-[#677787]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
