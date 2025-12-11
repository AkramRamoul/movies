"use server";

import { getMovieReviews, isReviewed } from "@/actions/movies";
import { RatingsChart } from "@/modules/film/ui/RatingsChart";
import LetterboxdMovieCard from "@/modules/home/ui/Movies/MovieCard";
import { currentUser } from "@clerk/nextjs/server";
import ReviewCard from "@/modules/film/ui/ReviewCard";
import { MovieTabs } from "@/modules/film/ui/MovieTabs";

const Home = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const movie = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.MOVIE_API_KEY}&i=${id}`
  ).then((r) => r.json());

  const user = await currentUser();
  const userId = user?.id;

  const reviewed = await isReviewed(id, userId!);
  const distribution = await getMovieReviews(id);

  return (
    <div className="max-w-7xl flex min-h-screen overflow-y-auto mx-auto px-6 md:px-40 gap-6 bg-noise pb-50">
      <div className="w-[25%] flex mt-3 sticky">
        <LetterboxdMovieCard
          Id={id}
          title={movie.Title}
          poster={movie.Poster}
          width="w-56"
          height="h-[350px]"
        />
      </div>
      <div className="flex-1 gap-6 flex-col mt-6 h-screen">
        <h1 className="text-4xl font-bold">{movie.Title}</h1>
        <p className="mt-4 text-base text-white/50">{movie.Plot}</p>
        <div className="flex flex-row gap-6">
          <div className="mt-12">
            <MovieTabs movie={movie} />
          </div>
          <div className="flex flex-col gap-2 mt-12">
            <ReviewCard userId={userId!} MovieId={id} reviewed={reviewed} />
            <div className=" rounded-md p-6 w-80 h-60 overflow-hidden">
              <div className="flex justify-between text-gray-400 mb-2 border-b-2 p-1">
                <span>RATINGS</span>
                <span>{distribution.total} FANS</span>
              </div>

              <div className="flex items-end gap-1 min-h-32">
                <RatingsChart
                  counts={distribution.counts}
                  total={distribution.total}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
