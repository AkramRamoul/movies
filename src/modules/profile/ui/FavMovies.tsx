import { getFavMoviesByUser } from "@/actions/movies";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/actions/user";
import LetterboxdMovieCard from "@/modules/home/ui/Movies/MovieCard";
import { fetchMovie } from "../lib/fetch";

const FavMovies = async () => {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id;

  const data = await getFavMoviesByUser(userId!);

  const movies = (
    await Promise.all(data.map((p) => fetchMovie(p.movieId)))
  ).filter(Boolean);

  return (
    <div>
      <h1 className="text-base mt-6 text-[#99a9ba] uppercase tracking-widest">
        Favorite films
      </h1>
      <Separator />

      <div className="grid grid-cols-2 md:grid-cols-4 mt-2 gap-x-1.5">
        {movies.map((movie) => (
          <LetterboxdMovieCard
            key={movie.imdbID}
            Id={movie.imdbID}
            poster={movie.Poster}
            title={movie.Title}
          />
        ))}
      </div>
    </div>
  );
};

export default FavMovies;
