export async function fetchMovie(imdbId: string) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.MOVIE_API_KEY}&i=${imdbId}`,
    { cache: "no-store" } // important for server components
  );

  if (!res.ok) {
    console.error("OMDb HTTP error:", res.status);
    return null;
  }

  const text = await res.text();

  try {
    const json = JSON.parse(text);

    if (json.Response === "False") {
      console.error("OMDb error:", json.Error);
      return null;
    }

    return json;
  } catch {
    console.error("OMDb returned non-JSON:", text.slice(0, 100));
    return null;
  }
}
