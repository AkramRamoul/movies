import { fetchMovie } from "@/modules/profile/lib/fetch";
import { Activity } from "@/types/types";
import Link from "next/link";

const WatchListedActivity = async ({ activity }: { activity: Activity }) => {
  const movie = await fetchMovie(activity.movieId!);
  if (!movie) {
    return <div className="text-sm">Watchlisted movie</div>;
  }

  return (
    <div className="text-sm text-[#657687] py-2 bg-[#1b2229] border-y-2 px-2">
      You added{" "}
      <Link
        className="text-sm text-white hover:text-[#b3b5b7]"
        href={`/film/${movie.imdbID}`}
      >
        {movie.Title}
      </Link>{" "}
      to your watchlist
    </div>
  );
};

export default WatchListedActivity;
