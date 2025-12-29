import { fetchMovie } from "@/modules/profile/lib/fetch";
import { Activity } from "@/types/types";
import Link from "next/link";

const WatchListedActivity = async ({ activity }: { activity: Activity }) => {
  const movie = await fetchMovie(activity.movieId!);
  if (!movie) {
    return <div className="text-sm">Watchlisted movie</div>;
  }

  return (
    <div className="py-2 bg-[#1b2229] border-y-2 px-2 flex justify-between">
      <div className="text-sm text-[#657687]">
        You added{" "}
        <Link
          className="text-sm text-white hover:text-[#b3b5b7]"
          href={`/film/${movie.imdbID}`}
        >
          {movie.Title}
        </Link>{" "}
        to your watchlist
      </div>
      <div className="text-xs text-[#8fa2b7]">9d</div>
    </div>
  );
};

export default WatchListedActivity;
