"use server";

import { isReviewed } from "@/actions/movies";
import { RatingsChart } from "@/modules/film/ui/RatingsChart";
import LetterboxdMovieCard from "@/modules/home/ui/Movies/MovieCard";
import { currentUser } from "@clerk/nextjs/server";
import ReviewCard from "@/modules/film/ui/ReviewCard";

const Home = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const movie = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.MOVIE_API_KEY}&i=${id}`
  ).then((r) => r.json());

  const user = await currentUser();
  const userId = user?.id;

  const reviewed = await isReviewed(id, userId!);

  return (
    <div className="max-w-7xl flex min-h-screen mx-auto px-6 md:px-40 gap-6 bg-noise pb-50">
      <div className="w-[25%] flex mt-3 sticky">
        <LetterboxdMovieCard
          Id={id}
          title={movie.Title}
          poster={movie.Poster}
          width="w-56"
          height="h-[280px]"
        />
      </div>
      <div className="flex-1 gap-6 flex-col mt-6 h-screen">
        <h1 className="text-4xl font-bold">{movie.Title}</h1>
        <p className="mt-4 text-base text-white/50">{movie.Plot}</p>
        <div className="flex flex-row gap-6">
          <div className="mt-12">
            <div className="flex gap-4 border-b border-gray-600 text-gray-400">
              {["CAST", "CREW", "DETAILS", "GENRES", "RELEASES"].map((tab) => (
                <button
                  key={tab}
                  className="pb-2 border-b-2 border-transparent hover:text-white hover:border-white"
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Content */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                movie.Director,
                movie.Writer,
                "Paul DeAngelo",
                "Jonathan Tiersten",
                "Felissa Rose",
              ].map((name) => (
                <span
                  key={name}
                  className="bg-gray-700 text-gray-200 px-3 py-1 rounded-md text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-12">
            <ReviewCard userId={userId!} MovieId={id} reviewed={reviewed} />

            {/* Ratings histogram */}
            <div className="bg-gray-800 rounded-md p-6 w-80 h-60 overflow-hidden">
              <div className="flex justify-between text-gray-400 mb-2">
                <span>RATINGS</span>
                <span>1.4K FANS</span>
              </div>

              <div className="flex items-end gap-1 min-h-32">
                <RatingsChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
