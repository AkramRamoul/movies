import { getPopularMovies } from "@/actions/movies";
import { Separator } from "@/components/ui/separator";
import LetterboxdMovieCard from "./MovieCard";

const PopularMovies = async () => {
  const data = await getPopularMovies();

  const movies = await Promise.all(
    data.map((p) =>
      fetch(
        `https://www.omdbapi.com/?apikey=${process.env.MOVIE_API_KEY}&i=${p.movieId}`
      ).then((r) => r.json())
    )
  );

  return (
    <div>
      <h1 className="text-base mt-6 text-[#99a9ba] uppercase tracking-widest">
        Popular on Letterboxd
      </h1>
      <Separator />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-1 mt-2">
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

export default PopularMovies;
