import { fetchMovie } from "@/modules/profile/lib/fetch";
import { Activity } from "@/types/types";
import Link from "next/link";

const WatchActivity = async ({ activity }: { activity: Activity }) => {
  const movie = await fetchMovie(activity.movieId!);
  if (!movie) {
    return <div className="text-sm">Movie not found</div>;
  }

  const now = new Date();
  const activityDate = activity.createdAt ? new Date(activity.createdAt) : now;

  const diffTime = now.getTime() - activityDate.getTime();

  const showTime = () => {
    const minutes = Math.floor(diffTime / (1000 * 60));
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${days}d`;
  };

  return (
    <div className="py-2 bg-[#1b2229] border-y-2 px-2 flex justify-between">
      <div className="text-sm text-[#657687]">
        {activity.rating ? (
          <div className="flex items-center">
            <span className="text-[#657687] mr-1">You watched and rated</span>
            <Link
              className="text-sm text-white hover:text-[#b3b5b7]"
              href={`/film/${movie.imdbID}`}
            >
              {movie.Title}
            </Link>{" "}
            <div className="flex items-center gap-1 text-green-400 text-xl ml-2">
              {"★".repeat(activity.rating!)}
              {activity.rating! % 1 !== 0 && "½"}
            </div>
            <span className="ml-1 text-[#657687]">
              On{" "}
              {activity.createdAt?.toLocaleDateString("en-US", {
                day: "numeric",
                weekday: "long",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        ) : (
          <>
            <span className="text-[#657687]">You watched </span>
            <Link
              className="text-sm text-white hover:text-[#b3b5b7]"
              href={`/film/${movie.imdbID}`}
            >
              {movie.Title}
            </Link>
            <span className="ml-1 text-[#657687]">
              On{" "}
              {activity.createdAt?.toLocaleDateString("en-US", {
                day: "numeric",
                weekday: "long",
                month: "short",
                year: "numeric",
              })}
            </span>
          </>
        )}
      </div>
      <div className="text-xs text-[#8fa2b7]">{showTime()}</div>
    </div>
  );
};

export default WatchActivity;
