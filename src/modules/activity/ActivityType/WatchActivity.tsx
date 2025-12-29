import { fetchMovie } from "@/modules/profile/lib/fetch";
import { Activity } from "@/types/types";
import Link from "next/link";

const WatchActivity = async ({ activity }: { activity: Activity }) => {
  const movie = await fetchMovie(activity.movieId!);
  if (!movie) {
    return <div className="text-sm">Watchlisted movie</div>;
  }
  if (!activity.rating) {
    return;
  }

  return (
    <div className="py-2 bg-[#1b2229] border-y-2 px-2 flex justify-between">
      <div className="text-sm text-[#657687]">
        You watched and rated
        <Link
          className="text-sm text-white hover:text-[#b3b5b7]"
          href={`/film/${movie.imdbID}`}
        >
          {movie.Title}
        </Link>{" "}
        <div className="flex items-center gap-1 mt-1 text-green-400">
          {"★".repeat(activity.rating!)}
          {activity.rating! % 1 !== 0 && "½"}
        </div>
      </div>
      <div className="text-xs text-[#8fa2b7]">9d</div>
    </div>
  );
};

export default WatchActivity;
