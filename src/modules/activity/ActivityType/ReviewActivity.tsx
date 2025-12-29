import { fetchMovie } from "@/modules/profile/lib/fetch";
import { Activity } from "@/types/types";
import Image from "next/image";

const ReviewActivity = async ({ activity }: { activity: Activity }) => {
  const movie = await fetchMovie(activity.movieId!);
  if (!movie) {
    return <div className="text-sm">Watchlisted movie</div>;
  }

  return (
    <div className="flex gap-4 py-4 border-b border-white/10 px-2">
      {/* Poster */}
      <div className="w-[70px] shrink-0">
        <Image
          src={movie.Poster}
          alt={movie.Title}
          width={70}
          height={105}
          className="rounded-xs object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="text-xs text-[#8fa2b7] mb-1">You watched</p>
        <h3 className="text-xl font-bold">
          {movie.Title}{" "}
          <span className="font-normal text-base text-white/70">
            {movie.Year}
          </span>
        </h3>
        {activity.rating && (
          <div className="flex items-center gap-1 mt-1 text-green-400">
            {activity.rating}
          </div>
        )}
        {/* {movie.reviewText && ( */}
        <p className="mt-2 text-sm text-[#c7d1db]">Good movie</p>
        {/* )} */}
      </div>
      <div className="text-xs text-[#8fa2b7]">9d</div>
    </div>
  );
};

export default ReviewActivity;
