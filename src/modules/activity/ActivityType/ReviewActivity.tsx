import { fetchMovie } from "@/modules/profile/lib/fetch";
import { Activity } from "@/types/types";
import Image from "next/image";

const ReviewActivity = async ({ activity }: { activity: Activity }) => {
  const movie = await fetchMovie(activity.movieId!);
  if (!movie) {
    return <div className="text-sm">Movie not found</div>;
  }

  return (
    <div className="flex gap-4 py-y border-b border-white/10 px-2">
      {/* Poster */}
      <div className="w-[90px] shrink-0">
        <Image
          src={movie.Poster}
          alt={movie.Title}
          width={90}
          height={120}
          className="rounded-xs object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="text-sm text-[#657687] mb-1">
          {activity.rewatch ? "You rewatched" : "You watched"}
        </p>
        <h3 className="text-3xl font-bold tracking-wide cursor-pointer hover:text-[#40BCF4]">
          {movie.Title}{" "}
          <span className=" text-lg font-light text-white/70">
            {movie.Year}
          </span>
        </h3>
        {activity.rating && (
          <div className="flex items-center gap-1 text-lg mt-1 text-green-400">
            {"★".repeat(activity.rating!)}
            {activity.rating! % 1 !== 0 && "½"}
          </div>
        )}
        {/* {movie.reviewText && ( */}
        <p className="mt-2 text-[#99a9ba]">Good movie</p>
        {/* )} */}
      </div>
      <div className="text-xs text-[#8fa2b7]">9d</div>
    </div>
  );
};

export default ReviewActivity;
