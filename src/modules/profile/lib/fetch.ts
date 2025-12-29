import { OmdbError, OmdbMovie } from "@/types/types";

export async function fetchMovie(imdbId: string): Promise<OmdbMovie | null> {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.MOVIE_API_KEY}&i=${imdbId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const text = await res.text();

  try {
    const json = JSON.parse(text) as OmdbMovie | OmdbError;

    if (json.Response === "False") {
      return null;
    }

    return json;
  } catch {
    return null;
  }
}
